import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Vendor } from "delivfree";
import { resetAppState } from "../resetAppState";
import { createVendor } from "../thunks/vendor";

export interface VendorState {
  data: Vendor | null;
}

const initialState: VendorState = {
  data: null,
};

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      createVendor.fulfilled,
      (state, action: PayloadAction<Vendor>) => {
        state.data = action.payload;
      }
    );
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setVendor } = vendorSlice.actions;

export default vendorSlice.reducer;
