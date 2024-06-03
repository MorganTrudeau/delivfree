import { createAsyncThunk } from "@reduxjs/toolkit";
import { Driver } from "delivfree";
import { setActiveDriver, setDriver } from "../reducers/driver";
import { setDrivers } from "../reducers/vendorDrivers";
import * as DriverApis from "../../apis/driver";

export const createDriver = createAsyncThunk(
  "driver/createDriver",
  async (driver: Driver) => {
    await DriverApis.createDriver(driver);
    return driver;
  }
);

export const listenToActiveDriver = createAsyncThunk(
  "driver/listenToActiveDriver",
  (driverId: string, { dispatch }) => {
    return DriverApis.listenToDriver(driverId, (driver) =>
      dispatch(setActiveDriver(driver))
    );
  }
);

export const listenToDriver = createAsyncThunk(
  "driver/listenToDriver",
  (driverId: string, { dispatch }) => {
    return DriverApis.listenToDriver(driverId, (driver) =>
      dispatch(setDriver(driver))
    );
  }
);

export const listenToDrivers = createAsyncThunk(
  "driver/listenToDrivers",
  (params: DriverApis.DriversListenerParams, { dispatch }) => {
    return DriverApis.listenToDrivers((drivers) => {
      dispatch(setDrivers(drivers));
    }, params);
  }
);
