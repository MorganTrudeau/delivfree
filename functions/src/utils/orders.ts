import { getTodaysDate } from ".";
import { DriverClockIn, Order } from "../types";
import * as admin from "firebase-admin";

export const formatOrderEmail = (checkoutItems: Order["checkoutItems"]) => {
  const formatCustomizations = (
    customizations: Order["checkoutItems"][number]["customizations"]
  ) => {
    return customizations
      .map((c) => {
        if (c.type === "note") {
          return `<p><${c.text}</p>`;
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
          return `<p>${c.choice.name} (x${c.quantity}) ${price}</p>`;
        }
        return "";
      })
      .join("");
  };

  const orderItems = checkoutItems
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

      return `<div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
        <img src="${item.item.image}" alt="${
        item.item.name
      }" style="width: 100px; height: 100px; object-fit: cover;">
        <h2 style="margin: 0;">${item.item.name}</h2>
        <span style="color: #666;">Qty: ${item.quantity}</span>
        <h4>Price: $${price}</h4>
        ${formatCustomizations(item.customizations)}
      </div>`;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif;">
      <h1>Your Order</h1>
      ${orderItems}
      <footer style="margin-top: 20px; font-size: 12px; color: #666;">
        Thank you for your order!
      </footer>
    </div>
  `;
};

export const assignOrderDriver = async (order: Order) => {
  const activeDriverSnap = await admin
    .firestore()
    .collection("DriverClockIns")
    .where("vendorLocation", "==", order.vendorLocation)
    .get();

  const activeDrivers = activeDriverSnap.docs.map((doc) => {
    const driverClockIn = doc.data() as DriverClockIn;
    return {
      ...driverClockIn,
      driverId: doc.id,
      ordersTaken: driverClockIn.ordersTaken || 0,
    };
  });

  const sortedDrivers = activeDrivers.sort((a, b) => {
    if (a.ordersTaken === b.ordersTaken) {
      return a.date - b.date;
    }
    return a.ordersTaken - b.ordersTaken;
  });

  const nextDriver = sortedDrivers[0];
  if (nextDriver) {
    const batch = admin.firestore().batch();
    batch.update(admin.firestore().collection("Orders").doc(order.id), {
      driver: nextDriver.driverId,
    });
    batch.set(
      admin
        .firestore()
        .collection("Drivers")
        .doc(nextDriver.driverId)
        .collection("OrderHistory")
        .doc(getTodaysDate()),
      { orders: nextDriver.ordersTaken + 1 }
    );
    await batch.commit();
  }
};

export const updateOrderAnalytics = async (order: Order) => {
  const { date, customer } = order;

  var today = new Date(date);

  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");

  var formattedDate = year + "-" + month + "-" + day;

  const tip = order.tip ? Number(order.tip) : 0;
  const amount = order?.total ? Number(order.total) : 0;

  const update: {
    count: admin.firestore.FieldValue;
    tips: admin.firestore.FieldValue;
    amount: admin.firestore.FieldValue;
    customer: {
      [id: string]: {
        amount: admin.firestore.FieldValue;
        tips: admin.firestore.FieldValue;
      };
    };
  } = {
    count: admin.firestore.FieldValue.increment(1),
    amount: admin.firestore.FieldValue.increment(amount),
    tips: admin.firestore.FieldValue.increment(tip),
    customer: {
      [customer]: {
        amount: admin.firestore.FieldValue.increment(amount),
        tips: admin.firestore.FieldValue.increment(tip),
      },
    },
  };

  await admin
    .firestore()
    .collection("VendorOrderCount")
    .doc(order.vendor)
    .collection("OrderCount")
    .doc(formattedDate)
    .set(update, { merge: true });
};
