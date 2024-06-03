import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { VendorLocation } from "delivfree";
import { resetAppState } from "../resetAppState";

export interface VendorLocationsState {
  data: { [id: string]: VendorLocation };
}

const initialState: VendorLocationsState = {
  data: {},
};

export const vendorLocationsSlice = createSlice({
  name: "vendorLocations",
  initialState,
  reducers: {
    setVendorLocations: (
      state,
      action: PayloadAction<{ [id: string]: VendorLocation }>
    ) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setVendorLocations } = vendorLocationsSlice.actions;

export default vendorLocationsSlice.reducer;
