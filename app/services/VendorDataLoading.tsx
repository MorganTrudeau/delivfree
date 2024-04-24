import { unwrapResult } from "@reduxjs/toolkit";
import { RootState } from "app/redux/store";
import { listenToCustomers } from "app/redux/thunks/customers";
import { listenToVendorDrivers } from "app/redux/thunks/driver";
import { listenToRestuarantLocations } from "app/redux/thunks/restaurantLocations";
import { listenToVendorSubscription } from "app/redux/thunks/subscription";
import { listenToVendor } from "app/redux/thunks/vendor";
import { Component } from "react";
import { ConnectedProps, connect } from "react-redux";

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
      .listenToVendor(vendorId)
      .then(unwrapResult);
  };

  listenToVendorData = async () => {
    const { vendor } = this.props;
    if (!vendor) {
      return;
    }

    const customersListener = await this.props
      .listenToCustomers(vendor.id)
      .then(unwrapResult);
    const restaurantLocationsListener = await this.props
      .listenToRestuarantLocations(vendor.id)
      .then(unwrapResult);
    const subscriptionListener = await this.props
      .listenToVendorSubscription(vendor.id)
      .then(unwrapResult);
    const driversListener = await this.props
      .listenToVendorDrivers(vendor.id)
      .then(unwrapResult);

    this.vendorDataListeners.add(customersListener);
    this.vendorDataListeners.add(restaurantLocationsListener);
    this.vendorDataListeners.add(subscriptionListener);
    this.vendorDataListeners.add(driversListener);
  };

  render() {
    return null;
  }
}

const mapState = (state: RootState) => ({
  vendor: state.vendor.data,
  user: state.user.user,
  driver: state.driver.data,
});

const mapDispatch = {
  listenToVendor,
  listenToVendorSubscription,
  listenToRestuarantLocations,
  listenToCustomers,
  listenToVendorDrivers,
};

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(VendorDataLoading);
