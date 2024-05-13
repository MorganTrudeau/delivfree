import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { MOMENT_DATE_FORMAT, Order } from "delivfree";
import moment from "moment";

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

export const loadOrders = async (
  params: {
    vendor: string;
    restaurantLocation?: string;
    limit?: number;
  },
  queries?: [
    fieldPath: keyof Order,
    opStr: FirebaseFirestoreTypes.WhereFilterOp,
    value: any
  ][]
) => {
  const { vendor, restaurantLocation, limit } = params;

  let query = firestore().collection("Orders").where("vendor", "==", vendor);

  if (restaurantLocation) {
    query = query.where("restaurantLocation", "==", restaurantLocation);
  }

  if (queries) {
    queries.forEach(([key, eq, val]) => {
      query = query.where(key, eq, val);
    });
  }

  if (limit) {
    query = query.limit(limit);
  }

  const snap = await query.get();

  return snap.docs.map((doc) => doc.data() as Order);
};

export const listenToOrderCount = (
  vendor: string,
  onData: (orderCount: { [date: string]: { count: number } }) => void
) => {
  return firestore()
    .collection("VendorOrderCount")
    .doc(vendor)
    .collection("OrderCount")
    .where(
      firestore.FieldPath.documentId(),
      ">=",
      moment().subtract(6, "days").format(MOMENT_DATE_FORMAT)
    )
    .where(
      firestore.FieldPath.documentId(),
      "<=",
      moment().format(MOMENT_DATE_FORMAT)
    )
    .onSnapshot((snap) => {
      if (snap) {
        onData(
          snap.docs.reduce(
            (acc, doc) => ({
              ...acc,
              [doc.id]: doc.data() as { count: number },
            }),
            {}
          )
        );
      } else {
        onData({});
      }
    });
};
