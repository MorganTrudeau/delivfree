import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Driver, License } from "delivfree";
import { resetAppState } from "../resetAppState";
import { RootState } from "../store";

export interface DriverState {
  data: { [id: string]: Driver };
  licenses: { [id: string]: License };
  licensesLoaded: boolean;
  activeDriver: Driver | null;
  activeDriverLoaded: boolean;
}

const initialState: DriverState = {
  data: {},
  licenses: {},
  licensesLoaded: false,
  activeDriver: null,
  activeDriverLoaded: false,
};

export const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setActiveDriver: (state, action: PayloadAction<Driver | null>) => {
      state.activeDriver = action.payload;
      state.activeDriverLoaded = true;
    },
    setDriver: (state, action: PayloadAction<Driver | null>) => {
      if (action.payload) {
        state.data = { ...state.data, [action.payload.id]: action.payload };
      }
    },
    setDrivers: (state, action: PayloadAction<{ [id: string]: Driver }>) => {
      state.data = action.payload;
    },
    setDriverLicenses: (
      state,
      action: PayloadAction<{ [id: string]: License }>
    ) => {
      state.licenses = action.payload;
      state.licensesLoaded = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setActiveDriver, setDriver, setDrivers, setDriverLicenses } =
  driverSlice.actions;

export default driverSlice.reducer;

export const selectApprovedDriverLicenses = createSelector(
  [(state: RootState) => state.driver.licenses],
  (licenses) => Object.values(licenses).filter((l) => l.status === "approved")
);
export const selectVendorIdsFromLicenses = createSelector(
  [(state: RootState) => state.driver.licenses],
  (licenses) =>
    Object.values(licenses)
      .filter((l) => l.status === "approved")
      .map((l) => l.vendor)
);
export const selectVendorLocationIdsFromLicenses = createSelector(
  [(state: RootState) => state.driver.licenses],
  (licenses) => {
    return Object.values(licenses)
      .filter((l) => l.status === "approved")
      .map((l) => l.vendorLocation);
  }
);
