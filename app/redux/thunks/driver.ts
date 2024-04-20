import { createAsyncThunk } from "@reduxjs/toolkit";
import { Driver } from "functions/src/types";
import firestore from "@react-native-firebase/firestore";
import { setDriver } from "../reducers/driver";

export const createDriver = createAsyncThunk(
  "driver/createDriver",
  async (driver: Driver) => {
    await firestore().collection("Drivers").doc(driver.id).set(driver);
    return driver;
  }
);

export const listenToDriver = createAsyncThunk(
  "driver/listenToDriver",
  (driverId: string, { dispatch }) => {
    return firestore()
      .collection("Drivers")
      .doc(driverId)
      .onSnapshot((doc) => dispatch(setDriver(doc.data() as Driver)));
  }
);
