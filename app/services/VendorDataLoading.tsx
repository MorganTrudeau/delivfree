import { unwrapResult } from "@reduxjs/toolkit";
import { RootState } from "app/redux/store";
import { listenToCustomers } from "app/redux/thunks/customers";
import { listenToPositions } from "app/redux/thunks/positions";
import { listenToVendorLocations } from "app/redux/thunks/vendorLocations";
import { fetchProducts } from "app/redux/thunks/stripe";
import { listenToVendorSubscription } from "app/redux/thunks/subscription";
import { listenToActiveVendor } from "app/redux/thunks/vendor";
import { Component } from "react";
import { ConnectedProps, connect } from "react-redux";
import { listenToVendorLicenses } from "app/redux/thunks/licenses";

interface Props extends ReduxProps {}

export class VendorDataLoading extends Component<Props> {
  unsubscribeVendorListener: () => void = () => {};
  vendorDataListeners = new Set<() => void>();

  vendorSelected = (props: Props) => {
    return props.user?.vendor?.ids?.[0];
  };

  vendorLoaded = (props: Props) => {
    return props.vendor;
  };

  unsubscribeListeners = (listenerSet: Set<() => void>) => {
    listenerSet.forEach((l) => l());
  };

  componentDidMount(): void {
    this.props.fetchProducts();
    this.vendorLoaded(this.props) && this.listenToVendorData();
    this.vendorSelected(this.props) && this.listenToVendor();
  }

  componentWillUnmount(): void {
    this.unsubscribeVendorListener();
    this.unsubscribeListeners(this.vendorDataListeners);
  }

  componentDidUpdate(prevProps: Props): void {
    if (!this.vendorSelected(prevProps) && this.vendorSelected(this.props)) {
      this.listenToVendor();
    } else if (
      this.vendorSelected(prevProps) &&
      !this.vendorSelected(this.props)
    ) {
      this.unsubscribeVendorListener();
    }

    if (!this.vendorLoaded(prevProps) && this.vendorLoaded(this.props)) {
      this.listenToVendorData();
    } else if (this.vendorLoaded(prevProps) && !this.vendorLoaded(this.props)) {
      this.unsubscribeListeners(this.vendorDataListeners);
    }
  }

  listenToVendor = async () => {
    const vendorId = this.props.user?.vendor?.ids?.[0];
    if (!vendorId) {
      return;
    }
    this.unsubscribeVendorListener = await this.props
      .listenToActiveVendor(vendorId)
      .then(unwrapResult);
  };

  listenToVendorData = async () => {
    const { vendor } = this.props;

    if (!vendor) {
      return;
    }

    const vendorLocationsListener = await this.props
      .listenToVendorLocations({ vendor: vendor.id })
      .then(unwrapResult);
    const subscriptionListener = await this.props
      .listenToVendorSubscription(vendor.id)
      .then(unwrapResult);
    const positionsListener = await this.props
      .listenToPositions(vendor.id)
      .then(unwrapResult);
    const licensesListener = await this.props
      .listenToVendorLicenses(vendor.id)
      .then(unwrapResult);

    this.vendorDataListeners.add(vendorLocationsListener);
    this.vendorDataListeners.add(subscriptionListener);
    this.vendorDataListeners.add(positionsListener);
    this.vendorDataListeners.add(licensesListener);
  };

  render() {
    return null;
  }
}

const mapState = (state: RootState) => ({
  vendor: state.vendor.activeVendor,
  user: state.user.user,
  driver: state.driver.activeDriver,
});

const mapDispatch = {
  listenToActiveVendor,
  listenToVendorSubscription,
  listenToVendorLicenses,
  listenToVendorLocations,
  listenToPositions,
  fetchProducts,
};

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(VendorDataLoading);
