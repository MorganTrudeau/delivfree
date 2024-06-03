import { createAsyncThunk } from "@reduxjs/toolkit";
import * as LicenseApis from "../../apis/licenses";
import { setDriverLicenses } from "../reducers/driver";
import { setVendorLicenses } from "../reducers/vendor";

export const listenToDriverLicenses = createAsyncThunk(
  "licenses/listenToDriverLicenses",
  async (driver: string, { dispatch }) => {
    return LicenseApis.listenToLicenses(
      (licenses) => {
        dispatch(setDriverLicenses(licenses));
      },
      { driver }
    );
  }
);

export const listenToVendorLicenses = createAsyncThunk(
  "licenses/listenToVendorLicenses",
  async (vendor: string, { dispatch }) => {
    return LicenseApis.listenToLicenses(
      (licenses) => {
        dispatch(setVendorLicenses(licenses));
      },
      { vendor }
    );
  }
);
