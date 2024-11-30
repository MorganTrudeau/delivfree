import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Cuisine } from "delivfree";

export interface CuisinesState {
  data: Cuisine[];
  loaded: boolean;
}

const initialState: CuisinesState = {
  data: [],
  loaded: false,
};

export const cuisinesSlice = createSlice({
  name: "cuisines",
  initialState,
  reducers: {
    setCuisines: (state, action: PayloadAction<Cuisine[]>) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCuisines } = cuisinesSlice.actions;

export default cuisinesSlice.reducer;
