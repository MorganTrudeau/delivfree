import { useAppSelector } from "app/redux/store";
import React from "react";
import DriverDataLoading from "./DriverDataLoading";
import VendorDataLoading from "./VendorDataLoading";
import { ConsumerDataLoading } from "./ConsumerDataLoading";
import AdminDataLoading from "./AdminDataLoading";

export const DataLoadingManager = () => {
  const userType = useAppSelector((state) => state.appConfig.userType);

  if (userType === "driver") {
    return <DriverDataLoading />;
  } else if (userType === "vendor") {
    return <VendorDataLoading />;
  } else if (userType === "consumer") {
    return <ConsumerDataLoading />;
  } else if (userType === "admin") {
    return <AdminDataLoading />;
  }

  return null;
};
