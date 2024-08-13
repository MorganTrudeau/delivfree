import { createAsyncThunk } from "@reduxjs/toolkit";
import { Status, Vendor } from "delivfree";
import firestore from "@react-native-firebase/firestore";
import { setActiveVendor, setVendor, setVendors } from "../reducers/vendor";
import * as VendorApis from "../../apis/vendors";

export const createVendor = createAsyncThunk(
  "vendors/createVendor",
  async (vendor: Vendor, { dispatch }) => {
    await firestore().collection("Vendors").doc(vendor.id).set(vendor);
    dispatch(setActiveVendor(vendor));
  }
);

export const listenToActiveVendor = createAsyncThunk(
  "vendors/listenToVendor",
  (vendorId: string, { dispatch }) => {
    return VendorApis.listenToVendor(vendorId, (vendor) =>
      dispatch(setActiveVendor(vendor))
    );
  }
);

export const listenToVendor = createAsyncThunk(
  "vendors/listenToVendor",
  (vendorId: string, { dispatch }) => {
    return VendorApis.listenToVendor(vendorId, (vendor) =>
      dispatch(setVendor(vendor))
    );
  }
);

export const listenToVendors = createAsyncThunk(
  "vendors/listenToVendor",
  (
    params: { limit?: number; status?: Status; ids?: string[] },
    { dispatch }
  ) => {
    return VendorApis.listenToVendors(
      (vendors) => dispatch(setVendors(vendors)),
      params
    );
  }
);

export const fetchVendor = createAsyncThunk(
  "vendors/fetchVendor",
  async (vendor: string, { dispatch }) => {
    const data = await VendorApis.fetchVendor(vendor);
    dispatch(setVendor(data));
  }
);
