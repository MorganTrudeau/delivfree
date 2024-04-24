import { createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import {
  setDriverSubscription,
  setVendorSubscription,
} from "../reducers/subscription";
import Stripe from "stripe";

export const listenToVendorSubscription = createAsyncThunk(
  "subscription/listenToVendorSubscription",
  (vendorId: string, { dispatch }) => {
    return firestore()
      .collection("Subscriptions")
      .doc(vendorId)
      .onSnapshot((doc) =>
        dispatch(
          setVendorSubscription(
            (doc.data()?.subscription || null) as Stripe.Subscription | null
          )
        )
      );
  }
);

export const listenToDriverSubscription = createAsyncThunk(
  "subscription/listenToDriverSubscription",
  (driverId: string, { dispatch }) => {
    return firestore()
      .collection("Subscriptions")
      .doc(driverId)
      .onSnapshot((doc) =>
        dispatch(
          setDriverSubscription(
            (doc.data()?.subscription || null) as Stripe.Subscription | null
          )
        )
      );
  }
);
