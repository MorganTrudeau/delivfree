import { createAsyncThunk } from "@reduxjs/toolkit";
import { setVendorLocations } from "../reducers/vendorLocations";
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
  (vendorLocation: string) => {
    return VendorLocationApis.fetchVendorLocation(vendorLocation);
  }
);
