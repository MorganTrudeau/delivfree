import { unwrapResult } from "@reduxjs/toolkit";
import { RootState } from "app/redux/store";
import { listenToActiveDriver } from "app/redux/thunks/driver";
import { listenToDriverLicenses } from "app/redux/thunks/licenses";
import { listenToVendorLocations } from "app/redux/thunks/vendorLocations";
import { listenToDriverSubscription } from "app/redux/thunks/subscription";
import { listenToVendors } from "app/redux/thunks/vendor";
import { Component } from "react";
import { ConnectedProps, connect } from "react-redux";
import { selectVendorLocationIdsFromLicenses } from "app/redux/reducers/driver";
import { equalArrays } from "app/utils/general";
import { listenToDriverAvailability } from "app/redux/thunks/driverAvailability";
import { listenToCuisines } from "app/redux/thunks/cuisines";

interface Props extends ReduxProps {}

export class DriverDataLoading extends Component<Props> {
  driverListeners = new Set<() => void>();
  vendorListeners = new Set<() => void>();

  driverSelected = (props: Props) => {
    return props.user?.driver?.id;
  };

  vendorSelected = (props: Props) => {
    return props.vendorLocationIds.length;
  };

  unsubscribeListeners = (listenerSet: Set<() => void>) => {
    listenerSet.forEach((l) => l());
  };

  componentDidMount(): void {
    this.props.listenToCuisines();
    this.driverSelected(this.props) && this.listenToDriverData();
    this.vendorSelected(this.props) && this.listenToVendorData();
  }

  componentDidUpdate(prevProps: Props): void {
    if (!this.driverSelected(prevProps) && this.driverSelected(this.props)) {
      this.unsubscribeListeners(this.driverListeners);
      this.listenToDriverData();
    } else if (
      this.driverSelected(prevProps) &&
      !this.driverSelected(this.props)
    ) {
      this.unsubscribeListeners(this.driverListeners);
    }

    if (
      this.vendorSelected(this.props) &&
      (!this.vendorSelected(prevProps) ||
        !equalArrays(this.props.vendorLocationIds, prevProps.vendorLocationIds))
    ) {
      this.unsubscribeListeners(this.vendorListeners);
      this.listenToVendorData();
    } else if (
      this.vendorSelected(prevProps) &&
      !this.vendorSelected(this.props)
    ) {
      this.unsubscribeListeners(this.vendorListeners);
    }
  }

  listenToDriverData = async () => {
    const driverId = this.props.user?.driver?.id;

    if (!driverId) {
      return;
    }

    const driverListener = await this.props
      .listenToActiveDriver(driverId)
      .then(unwrapResult);

    const subscriptionDriverId =
      this.props.user?.driver?.parentDriver || driverId;

    const driverSubscriptionListener = await this.props
      .listenToDriverSubscription(subscriptionDriverId)
      .then(unwrapResult);
    const licensesListener = await this.props
      .listenToDriverLicenses(subscriptionDriverId)
      .then(unwrapResult);
    const driverAvailabilityListener = await this.props
      .listenToDriverAvailability(subscriptionDriverId)
      .then(unwrapResult);

    this.driverListeners.add(driverListener);
    this.driverListeners.add(driverSubscriptionListener);
    this.driverListeners.add(licensesListener);
    this.driverListeners.add(driverAvailabilityListener);
  };

  listenToVendorData = async () => {
    const vendorLocationsIds = this.props.vendorLocationIds;

    if (!vendorLocationsIds.length) {
      return;
    }

    const vendorLocationsListener = await this.props
      .listenToVendorLocations({ id: vendorLocationsIds })
      .then(unwrapResult);

    this.vendorListeners.add(vendorLocationsListener);
  };

  render() {
    return null;
  }
}

const mapState = (state: RootState) => ({
  user: state.user.user,
  driver: state.driver.activeDriver,
  vendorLocationIds: selectVendorLocationIdsFromLicenses(state),
});

const mapDispatch = {
  listenToVendors,
  listenToActiveDriver,
  listenToDriverSubscription,
  listenToVendorLocations,
  listenToDriverLicenses,
  listenToDriverAvailability,
  listenToCuisines,
};

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(DriverDataLoading);
