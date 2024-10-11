import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { resetAppState } from "../resetAppState";
import { DriverAvailability } from "delivfree";

export interface DriverAvailabilityState {
  data: DriverAvailability[];
}

const initialState: DriverAvailabilityState = {
  data: [],
};

export const driverClockInSlice = createSlice({
  name: "driverAvailability",
  initialState,
  reducers: {
    setDriverAvailability: (
      state,
      action: PayloadAction<DriverAvailability[]>
    ) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setDriverAvailability } = driverClockInSlice.actions;

export default driverClockInSlice.reducer;
