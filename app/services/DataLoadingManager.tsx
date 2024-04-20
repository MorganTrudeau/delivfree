import { PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import { RootState } from "app/redux/store";
import { listenToCustomers } from "app/redux/thunks/customers";
import { listenToDriver } from "app/redux/thunks/driver";
import { listenToRestuarantLocations } from "app/redux/thunks/restaurantLocations";
import { listenToSubscription } from "app/redux/thunks/subscription";
import { listenToVendor } from "app/redux/thunks/vendor";
import { getAppType } from "app/utils/general";
import React from "react";
import { ConnectedProps, connect } from "react-redux";

interface Props extends ReduxProps {}

class DataLoadingManager extends React.Component<Props> {
  userListeners = new Set<() => void>();
  vendorListeners = new Set<() => void>();
  driverListeners = new Set<() => void>();

  addThunkListener = async (
    set: Set<() => void>,
    listener: () => Promise<{
      payload: () => void;
      meta?: any;
      error?: any;
    }>
  ) => {
    const l = await listener().then(unwrapResult);
    set.add(l);
  };

  userLoaded = (props: Props) => {
    const appType = getAppType();
    return (
      props.user &&
      ((appType === "CONSUMER" && props.user.consumer) ||
        (appType === "VENDOR" && (props.user.vendor || props.user.driver)) ||
        (appType === "ADMIN" && props.user.admin))
    );
  };

  vendorLoaded = (props: Props) => {
    return getAppType() === "VENDOR" && props.vendor;
  };

  driverLoaded = (props: Props) => {
    return getAppType() === "VENDOR" && props.driver;
  };

  componentDidMount(): void {
    this.userLoaded(this.props) && this.loadUserData();
    this.vendorLoaded(this.props) && this.loadVendorData();
    this.driverLoaded(this.props) && this.loadDriverData();
  }

  componentDidUpdate(prevProps: Props): void {
    if (!this.userLoaded(prevProps) && this.userLoaded(this.props)) {
      this.loadUserData();
    }
    if (!this.vendorLoaded(prevProps) && this.vendorLoaded(this.props)) {
      this.loadVendorData();
    }
    if (!this.driverLoaded(prevProps) && this.driverLoaded(this.props)) {
      this.loadDriverData();
    }
  }

  loadUserData = async () => {
    const { user } = this.props;
    if (!user) {
      return;
    }
    const appType = getAppType();
    if (appType === "CONSUMER") {
      this.loadConsumerData();
    } else if (appType === "VENDOR") {
      const vendorId = user.vendor?.ids[0];
      if (vendorId) {
        const vendorListener = await this.props
          .listenToVendor(vendorId)
          .then(unwrapResult);
        this.userListeners.add(vendorListener);
      }
      const driverId = user.driver?.id;
      if (driverId) {
        const driverListener = await this.props
          .listenToDriver(driverId)
          .then(unwrapResult);
        this.userListeners.add(driverListener);
      }
    } else if (appType === "ADMIN") {
      this.loadAdminData();
    }
  };

  loadVendorData = async () => {
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
      .listenToSubscription(vendor.id)
      .then(unwrapResult);

    this.vendorListeners.add(customersListener);
    this.vendorListeners.add(restaurantLocationsListener);
    this.vendorListeners.add(subscriptionListener);
  };

  loadDriverData = async () => {
    const { driver } = this.props;
    if (!driver) {
      return;
    }
    const subscriptionListener = await this.props
      .listenToSubscription(driver.id)
      .then(unwrapResult);
    this.driverListeners.add(subscriptionListener);
  };

  loadConsumerData = () => {};

  loadAdminData = () => {};

  render() {
    return null;
  }
}

const mapState = (state: RootState) => ({
  user: state.user.user,
  vendor: state.vendor.data,
  driver: state.driver.data,
});

const mapDispatch = {
  listenToCustomers,
  listenToVendor,
  listenToDriver,
  listenToRestuarantLocations,
  listenToSubscription,
};

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(DataLoadingManager);
