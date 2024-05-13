import { createAsyncThunk } from "@reduxjs/toolkit";
import { Driver } from "delivfree";
import firestore from "@react-native-firebase/firestore";
import { setDriver } from "../reducers/driver";
import { setDrivers } from "../reducers/vendorDrivers";

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
      .onSnapshot((doc) =>
        dispatch(setDriver((doc?.data() || null) as Driver | null))
      );
  }
);

export const listenToVendorDrivers = createAsyncThunk(
  "driver/listenToVendorDrivers",
  (vendorId: string, { dispatch }) => {
    return firestore()
      .collection("Drivers")
      .where("vendors", "array-contains", vendorId)
      .onSnapshot((snap) => {
        const drivers = snap
          ? snap.docs.reduce(
              (acc, doc) => ({ ...acc, [doc.id]: doc.data() as Driver }),
              {} as { [id: string]: Driver }
            )
          : ({} as { [id: string]: Driver });
        dispatch(setDrivers(drivers));
      });
  }
);
