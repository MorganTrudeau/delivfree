import firestore from "@react-native-firebase/firestore";
import { Order } from "functions/src/types";

export const loadOrders = async (
  vendor: string,
  restaurantLocation: string,
  limit: number
) => {
  console.log({ vendor, restaurantLocation });
  const snap = await firestore()
    .collection("Orders")
    .orderBy("date", "desc")
    .where("vendor", "==", vendor)
    .where("restaurantLocation", "==", restaurantLocation)
    .limit(limit)
    .get();
  return snap.docs.map((doc) => doc.data() as Order);
};
