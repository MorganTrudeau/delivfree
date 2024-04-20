import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { resetAppState } from "../resetAppState";
import { Stripe } from "stripe";

export interface SubscriptionState {
  data: Stripe.Subscription | null;
}

const initialState: SubscriptionState = {
  data: null,
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription: (
      state,
      action: PayloadAction<Stripe.Subscription | null>
    ) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
