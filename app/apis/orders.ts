import firestore from "@react-native-firebase/firestore";
import { Order } from "functions/src/types";

export const listenToOrders = (
  vendor: string,
  restaurantLocation: string,
  limit: number,
  onData: (order: Order[]) => void
) => {
  return firestore()
    .collection("Orders")
    .orderBy("date", "desc")
    .where("vendor", "==", vendor)
    .where("restaurantLocation", "==", restaurantLocation)
    .limit(limit)
    .onSnapshot((snap) => {
      if (snap) {
        onData(snap.docs.map((doc) => doc.data() as Order));
      } else {
        onData([]);
      }
    });
};

export const updateOrder = (orderId: string, update: Partial<Order>) => {
  return firestore().collection("Orders").doc(orderId).update(update);
};
