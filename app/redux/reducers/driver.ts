import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Driver, Vendor } from "delivfree";
import { resetAppState } from "../resetAppState";

export interface DriverState {
  data: Driver | null;
}

const initialState: DriverState = {
  data: null,
};

export const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDriver: (state, action: PayloadAction<Driver | null>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setDriver } = driverSlice.actions;

export default driverSlice.reducer;
