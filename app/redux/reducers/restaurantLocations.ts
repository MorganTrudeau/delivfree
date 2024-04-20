import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RestaurantLocation } from "delivfree";
import { resetAppState } from "../resetAppState";

export interface RestaurantLocationsState {
  data: { [id: string]: RestaurantLocation };
}

const initialState: RestaurantLocationsState = {
  data: {},
};

export const restaurantLocationsSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setRestaurantLocations: (
      state,
      action: PayloadAction<{ [id: string]: RestaurantLocation }>
    ) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setRestaurantLocations } = restaurantLocationsSlice.actions;

export default restaurantLocationsSlice.reducer;
