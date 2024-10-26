import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { getTotalPositions } from "app/utils/positions";
import { getPositionsFromSubscription } from "app/utils/subscriptions";
import { User } from "delivfree";

const getVendor = (state: RootState) => state.vendor.activeVendor;
const getDriver = (state: RootState) => state.driver.activeDriver;
const getVendorSubscription = (state: RootState) =>
  state.subscription.vendorSubscription;
const getDriverSubscription = (state: RootState) =>
  state.subscription.driverSubscription;
const getUserType = (state: RootState) => state.appConfig.userType;
const getVendorLicenses = (state: RootState) => state.vendor.licenses;
const getDriverLicenses = (state: RootState) => state.driver.licenses;
const getActiveUser = (state: RootState) => state.user.user;

export const selectSubscriptionValid = createSelector(
  [
    getVendor,
    getDriver,
    getVendorSubscription,
    getDriverSubscription,
    getUserType,
    getVendorLicenses,
    getDriverLicenses,
  ],
  (
    vendor,
    driver,
    vendorSubscription,
    driverSubscription,
    userType,
    vendorLicenses,
    driverLicenses
  ) => {
    const approvedLicenses = Object.values(
      userType === "vendor" ? vendorLicenses : driverLicenses
    ).filter((l) => l.status === "approved");

    const hasFreeSubscription =
      (userType === "vendor" && vendor && vendor?.hasFreeSubscription) ||
      (userType === "driver" && driver && driver.hasFreeSubscription);

    if (hasFreeSubscription) {
      return true;
    }

    const subscription =
      userType === "driver" ? driverSubscription : vendorSubscription;

    if (userType === "vendor" && !approvedLicenses.length) {
      return true;
    }

    if (!approvedLicenses.length || !subscription) {
      return false;
    }

    const { fullTime: licensedFullTime, partTime: licensedPartTime } =
      getTotalPositions(approvedLicenses);
    const { fullTime: subscribedFullTime, partTime: subscribedPartTime } =
      getPositionsFromSubscription(subscription);

    return (
      ["active", "trialing"].includes(subscription.status) &&
      licensedFullTime === subscribedFullTime &&
      licensedPartTime === subscribedPartTime
    );
  }
);

export const isTestUser = createSelector([getActiveUser], (user) => {
  return !!user?.isTester;
});
