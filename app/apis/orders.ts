import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { MOMENT_DATE_FORMAT, Order } from "delivfree";
import moment from "moment";

export const createOrder = (order: Order) => {
  return firestore().collection("Orders").doc(order.id).set(order);
};

export const createPendingOrder = (order: Order) => {
  return firestore().collection("PendingOrders").doc(order.id).set(order);
};

export type OrderListenerParams = {
  driver?: string;
  vendorLocation?: string;
  limit?: number;
  startDate?: number;
  endDate?: number;
};
export const listenToOrders = (
  onData: (order: Order[]) => void,
  params: OrderListenerParams = {}
) => {
  const { driver, vendorLocation, limit, startDate, endDate } = params;

  let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =
    firestore().collection("Orders").orderBy("date", "desc");

  if (driver) {
    query = query.where("driver", "==", driver);
  }

  if (vendorLocation) {
    query = query.where("vendorLocation", "==", vendorLocation);
  }

  if (startDate) {
    query = query.where("date", ">=", startDate);
  }

  if (endDate) {
    query = query.where("date", "<=", endDate);
  }

  if (limit) {
    query = query.limit(limit);
  }

  return query.onSnapshot(
    (snap) => {
      if (snap) {
        onData(snap.docs.map((doc) => doc.data() as Order));
      } else {
        onData([]);
      }
    },
    (error) => {
      console.log("Orders listener error", error);
    }
  );
};

export const updateOrder = (orderId: string, update: Partial<Order>) => {
  return firestore().collection("Orders").doc(orderId).update(update);
};

export const loadOrders = async (
  params: {
    vendor: string;
    vendorLocation?: string;
    limit?: number;
  },
  queries?: [
    fieldPath: keyof Order,
    opStr: FirebaseFirestoreTypes.WhereFilterOp,
    value: any
  ][]
) => {
  const { vendor, vendorLocation, limit } = params;

  let query = firestore().collection("Orders").where("vendor", "==", vendor);

  if (vendorLocation) {
    query = query.where("vendorLocation", "==", vendorLocation);
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
