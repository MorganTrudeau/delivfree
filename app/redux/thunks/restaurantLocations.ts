import { createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import { setRestaurantLocations } from "../reducers/restaurantLocations";

export const listenToRestuarantLocations = createAsyncThunk(
  "vendors/listenToVendor",
  (vendor: string, { dispatch }) => {
    return firestore()
      .collection("RestaurantLocations")
      .where("vendor", "==", vendor)
      .onSnapshot((snap) => {
        if (snap) {
          dispatch(
            setRestaurantLocations(
              snap.docs.reduce(
                (acc, doc) => ({ ...acc, [doc.id]: doc.data() }),
                {}
              )
            )
          );
        } else {
          dispatch(setRestaurantLocations({}));
        }
      });
  }
);
