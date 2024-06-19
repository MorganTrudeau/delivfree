import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { VendorLocation } from "delivfree";
import { resetAppState } from "../resetAppState";
import { fetchVendorLocation } from "../thunks/vendorLocations";

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
    builder.addCase(fetchVendorLocation.fulfilled, (state, action) => {
      if (action.payload) {
        state.data = { ...state.data, [action.payload.id]: action.payload };
      }
    });
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setVendorLocations } = vendorLocationsSlice.actions;

export default vendorLocationsSlice.reducer;
