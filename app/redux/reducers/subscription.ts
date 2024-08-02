import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { resetAppState } from "../resetAppState";
import { Stripe } from "stripe";
import { fetchProducts } from "../thunks/stripe";

export interface SubscriptionState {
  vendorSubscription: Stripe.Subscription | null | undefined;
  vendorSubscriptionLoaded: boolean;
  driverSubscription: Stripe.Subscription | null | undefined;
  driverSubscriptionLoaded: boolean;
  products: {
    vendorFullTime: Stripe.Product | null;
    vendorPartTime: Stripe.Product | null;
    driverFullTime: Stripe.Product | null;
    driverPartTime: Stripe.Product | null;
  };
}

const initialState: SubscriptionState = {
  vendorSubscription: undefined,
  vendorSubscriptionLoaded: false,
  driverSubscription: undefined,
  driverSubscriptionLoaded: false,
  products: {
    vendorFullTime: null,
    vendorPartTime: null,
    driverFullTime: null,
    driverPartTime: null,
  },
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
      state.vendorSubscriptionLoaded = true;
    },
    setDriverSubscription: (
      state,
      action: PayloadAction<Stripe.Subscription | null>
    ) => {
      state.driverSubscription = action.payload;
      state.driverSubscriptionLoaded = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setVendorSubscription, setDriverSubscription } =
  subscriptionSlice.actions;

export default subscriptionSlice.reducer;
