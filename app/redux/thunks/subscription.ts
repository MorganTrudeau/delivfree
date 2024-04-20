import { createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import { setSubscription } from "../reducers/subscription";
import Stripe from "stripe";

export const listenToSubscription = createAsyncThunk(
  "subscription/listenToSubscription",
  (userId: string, { dispatch }) => {
    return firestore()
      .collection("Subscriptions")
      .doc(userId)
      .onSnapshot((doc) =>
        dispatch(
          setSubscription(
            (doc.data()?.subscription || null) as Stripe.Subscription | null
          )
        )
      );
  }
);
