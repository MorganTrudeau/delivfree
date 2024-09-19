import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { MOMENT_DATE_FORMAT, Order, VendorLocation } from "delivfree";
import moment from "moment";
import functions from "@react-native-firebase/functions";
import { fetchVendorLocation } from "./vendorLocations";

export const createOrder = (order: Order) => {
  return firestore().collection("Orders").doc(order.id).set(order);
};

export const createPendingOrder = (order: Order) => {
  return firestore().collection("PendingOrders").doc(order.id).set(order);
};

export const fetchOrder = async (id: string) => {
  const doc = await firestore().collection("Orders").doc(id).get();
  return doc.data() as Order | undefined;
};

export const listenToActiveCustomerOrder = (
  user: string,
  onData: (order: Order | undefined) => void
) => {
  return firestore()
    .collection("Orders")
    .where("customer", "==", user)
    .where("status", "!=", "complete")
    .onSnapshot(
      (snap) => {
        console.log("SNAP", snap);
        const order = snap?.docs[0]
          ? (snap.docs[0].data() as Order)
          : undefined;
        onData(order);
      },
      (error) => {
        console.log("listenToActiveCustomerOrder error", error);
      }
    );
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

export const sendOrderConfirmationEmail = async () => {
  const order = await fetchOrder("0b5cf96ef4fdbc7a579cd3da38d12672b926");

  if (!order) {
    throw "missing-order";
  }

  const vendorLocation = await fetchVendorLocation(order.vendorLocation);

  if (!vendorLocation) {
    throw "missing-vendor-location";
  }

  // console.log(formatOrderEmail(order));

  return functions().httpsCallable("sendEmail")({
    to: "morgantrudeau@gmail.com",
    title: "Order Receipt",
    html: formatOrderEmail(order, vendorLocation),
  });
};

export const formatOrderEmail = (
  order: Order,
  vendorLocation: VendorLocation
) => {
  const formatCustomizations = (
    customizations: Order["checkoutItems"][number]["customizations"]
  ) => {
    return customizations
      .map((c, index) => {
        const style = `color: #666;margin-bottom:0;margin-top:${
          index === 0 ? 10 : 5
        }px;`;
        if (c.type === "note") {
          return `<div style="${style}">${c.text}</div>`;
        } else if (c.type === "choice") {
          const price = (Number(c.choice.price) * c.quantity).toLocaleString(
            undefined,
            {
              style: "currency",
              currency: "CAD",
              // @ts-ignore
              currencyDisplay: "narrowSymbol", // This fails on some OS
            }
          );
          return `<div style="${style}">${c.choice.name} (x${c.quantity}) ${price}</div>`;
        }
        return "";
      })
      .join("");
  };

  const orderItems = order.checkoutItems
    .map((item) => {
      const price = (Number(item.item.price) * item.quantity).toLocaleString(
        undefined,
        {
          style: "currency",
          currency: "CAD",
          // @ts-ignore
          currencyDisplay: "narrowSymbol", // This fails on some OS
        }
      );

      return `<div style="border: 1px solid #ccc; padding: 10px 15px; margin-bottom: 10px; border-radius: 5px;">
          <div style="display:flex;">
            <h3 style="margin: 0;">${
              item.item.name
            } <span style="font-weight:300;">(x${
              item.quantity
            })</span> ${price}</h4>
          </div>
        ${formatCustomizations(item.customizations)}
      </div>`;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif;background-color: #faf9f9;padding: 20px;">
      <div style="max-width: 600px;background-color: #fff;margin: 0 auto;padding: 30px;">
        <h1>Your Order</h1>
        <h3>Here is your receipt from ${vendorLocation.name}</h3>
        ${orderItems}
        <div style="padding: 15px 0">
          <span>Subtotal: ${order.subtotal}</span><br/>
          <span>Tip: ${order.tip}</span><br/>
          <span>Tax: ${order.tax}</span><br/>
          <span><strong>Total: ${order.total}</strong></span>
        </div>

        <footer style="color: #666;">
          Thank you for your order!
        </footer>
        <img src="https://order.delivfree.com/app-logo-inline.png" width=100 height=auto style="margin-top: 15px;" />
      </div>
    </div>
  `;
};
