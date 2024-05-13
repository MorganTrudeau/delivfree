import { createAsyncThunk } from "@reduxjs/toolkit";
import { Vendor } from "delivfree";
import firestore from "@react-native-firebase/firestore";
import { setVendor } from "../reducers/vendor";

export const createVendor = createAsyncThunk(
  "vendors/createVendor",
  async (vendor: Vendor) => {
    await firestore().collection("Vendors").doc(vendor.id).set(vendor);
    return vendor;
  }
);

export const listenToVendor = createAsyncThunk(
  "vendors/listenToVendor",
  (vendorId: string, { dispatch }) => {
    return firestore()
      .collection("Vendors")
      .doc(vendorId)
      .onSnapshot((doc) => dispatch(setVendor(doc.data() as Vendor)));
  }
);
