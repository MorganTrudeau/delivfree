import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { resetAppState } from "../resetAppState";

export interface DriverClockInState {
  data: { vendorLocation: string; date: number } | null;
}

const initialState: DriverClockInState = {
  data: null,
};

export const driverClockInSlice = createSlice({
  name: "driverClockIn",
  initialState,
  reducers: {
    setDriverClockInStatus: (
      state,
      action: PayloadAction<{ vendorLocation: string; date: number } | null>
    ) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setDriverClockInStatus } = driverClockInSlice.actions;

export default driverClockInSlice.reducer;
