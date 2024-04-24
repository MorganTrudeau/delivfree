import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Driver } from "delivfree";
import { resetAppState } from "../resetAppState";

export interface VendorDriversState {
  data: { [id: string]: Driver };
}

const initialState: VendorDriversState = {
  data: {},
};

export const vendorDriversSlice = createSlice({
  name: "vendorDrivers",
  initialState,
  reducers: {
    setDrivers: (state, action: PayloadAction<{ [id: string]: Driver }>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setDrivers } = vendorDriversSlice.actions;

export default vendorDriversSlice.reducer;
