import { createAsyncThunk } from "@reduxjs/toolkit";
import * as DriverAvailabilityApis from "../../apis/driverAvailablity";
import { setDriverAvailability } from "../reducers/driverAvailability";

export const listenToDriverAvailability = createAsyncThunk(
  "driverAvailability/listenToDriverAvailability",
  async (driver: string, { dispatch }) => {
    return DriverAvailabilityApis.listenToDriverAvailability(
      driver,
      (driverAvailability) => {
        dispatch(setDriverAvailability(driverAvailability));
      }
    );
  }
);
