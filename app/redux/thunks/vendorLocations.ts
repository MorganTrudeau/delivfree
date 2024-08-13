import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setVendorLocation,
  setVendorLocations,
} from "../reducers/vendorLocations";
import * as VendorLocationApis from "../../apis/vendorLocations";

export const listenToVendorLocations = createAsyncThunk(
  "vendorLocations/listenToVendorLocations",
  (
    params: { id?: string | string[]; vendor?: string | string[] },
    { dispatch }
  ) => {
    return VendorLocationApis.listenToVendorLocations((vendorLocations) => {
      dispatch(setVendorLocations(vendorLocations));
    }, params);
  }
);

export const fetchVendorLocation = createAsyncThunk(
  "vendorLocations/fetchVendorLocation",
  async (vendorLocation: string, { dispatch }) => {
    const data = await VendorLocationApis.fetchVendorLocation(vendorLocation);
    dispatch(setVendorLocation(data));
  }
);
