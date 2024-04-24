import { unwrapResult } from "@reduxjs/toolkit";
import { RootState } from "app/redux/store";
import { listenToCustomers } from "app/redux/thunks/customers";
import { listenToDriver, listenToVendorDrivers } from "app/redux/thunks/driver";
import { listenToRestuarantLocations } from "app/redux/thunks/restaurantLocations";
import {
  listenToDriverSubscription,
  listenToVendorSubscription,
} from "app/redux/thunks/subscription";
import { listenToVendor } from "app/redux/thunks/vendor";
import { Component, ReactNode } from "react";
import { ConnectedProps, connect } from "react-redux";

interface Props extends ReduxProps {}

export class DriverDataLoading extends Component<Props> {
  driverListeners = new Set<() => void>();
  vendorListeners = new Set<() => void>();

  driverSelected = (props: Props) => {
    return props.user?.driver?.id;
  };

  vendorSelected = (props: Props) => {
    return props.driver?.vendors?.[0];
  };

  unsubscribeListeners = (listenerSet: Set<() => void>) => {
    listenerSet.forEach((l) => l());
  };

  componentDidMount(): void {
    this.driverSelected(this.props) && this.listenToDriverData();
    this.vendorSelected(this.props) && this.listenToVendorData();
  }

  componentDidUpdate(prevProps: Props): void {
    if (!this.driverSelected(prevProps) && this.driverSelected(this.props)) {
      this.listenToDriverData();
    } else if (
      this.driverSelected(prevProps) &&
      !this.driverSelected(this.props)
    ) {
      this.unsubscribeListeners(this.driverListeners);
    }

    if (!this.vendorSelected(prevProps) && this.vendorSelected(this.props)) {
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
      .listenToDriver(driverId)
      .then(unwrapResult);
    const driverSubscriptionListener = await this.props
      .listenToDriverSubscription(driverId)
      .then(unwrapResult);

    this.driverListeners.add(driverListener);
    this.driverListeners.add(driverSubscriptionListener);
  };

  listenToVendorData = async () => {
    const vendorId = this.props.driver?.vendors?.[0];

    console.log("LOAD VENDOR DATA", vendorId);

    if (!vendorId) {
      return;
    }

    const vendorListener = await this.props
      .listenToVendor(vendorId)
      .then(unwrapResult);
    const vendorSubscriptionListener = await this.props
      .listenToVendorSubscription(vendorId)
      .then(unwrapResult);
    const restaurantLocationsListener = await this.props
      .listenToRestuarantLocations(vendorId)
      .then(unwrapResult);
    const customersListener = await this.props
      .listenToCustomers(vendorId)
      .then(unwrapResult);
    const driversListener = await this.props
      .listenToVendorDrivers(vendorId)
      .then(unwrapResult);

    this.vendorListeners.add(vendorListener);
    this.vendorListeners.add(vendorSubscriptionListener);
    this.vendorListeners.add(restaurantLocationsListener);
    this.vendorListeners.add(customersListener);
    this.vendorListeners.add(driversListener);
  };

  render() {
    return null;
  }
}

const mapState = (state: RootState) => ({
  user: state.user.user,
  driver: state.driver.data,
});

const mapDispatch = {
  listenToVendor,
  listenToDriver,
  listenToVendorSubscription,
  listenToDriverSubscription,
  listenToRestuarantLocations,
  listenToCustomers,
  listenToVendorDrivers,
};

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(DriverDataLoading);
