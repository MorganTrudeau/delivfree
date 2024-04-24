import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { resetAppState } from "../resetAppState";
import { Stripe } from "stripe";

export interface SubscriptionState {
  vendorSubscription: Stripe.Subscription | null | undefined;
  driverSubscription: Stripe.Subscription | null | undefined;
}

const initialState: SubscriptionState = {
  vendorSubscription: undefined,
  driverSubscription: undefined,
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setVendorSubscription: (
      state,
      action: PayloadAction<Stripe.Subscription | null>
    ) => {
      state.vendorSubscription = action.payload;
    },
    setDriverSubscription: (
      state,
      action: PayloadAction<Stripe.Subscription | null>
    ) => {
      state.driverSubscription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setVendorSubscription, setDriverSubscription } =
  subscriptionSlice.actions;

export default subscriptionSlice.reducer;
