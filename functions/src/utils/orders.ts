import { getTodaysDate } from ".";
import { DriverAvailability, Order, VendorLocation } from "../types";
import * as admin from "firebase-admin";

export const formatOrderEmail = (
  order: Order,
  vendorLocation: VendorLocation
) => {
  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString(undefined, {
      style: "currency",
      currency: "CAD",
      // @ts-ignore
      currencyDisplay: "narrowSymbol", // This fails on some OS
    });
  };

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
          return `<div style="${style}">${c.choice.name} (x${
            c.quantity
          }) ${formatPrice(Number(c.choice.price) * c.quantity)}</div>`;
        }
        return "";
      })
      .join("");
  };

  const orderItems = order.checkoutItems
    .map((item) => {
      return `<div style="border: 1px solid #ccc; padding: 10px 15px; margin-bottom: 10px; border-radius: 5px;">
          <div style="display:flex;">
            <h3 style="margin: 0;">${
              item.item.name
            } <span style="font-weight:300;">(x${
        item.quantity
      })</span> ${formatPrice(Number(item.item.price) * item.quantity)}</h3>
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
        <div style="padding: 10px 0">
          <span>Subtotal: ${formatPrice(order.subtotal)}</span><br/>
          <span>Tip: ${formatPrice(order.tip)}</span><br/>
          <span>Tax: ${formatPrice(order.tax)}</span><br/>
          <span><strong>Total: ${formatPrice(order.total)}</strong></span>
        </div>

        <footer style="color: #666;">
          Thank you for your order!
        </footer>
      </div>
    </div>
  `;
};

export const assignOrderDriver = async (order: Order) => {
  const activeDriverSnap = await admin
    .firestore()
    .collection("DriverAvailability")
    .where("vendorLocation", "==", order.vendorLocation)
    .get();

  const activeDrivers = activeDriverSnap.docs.map((doc) => {
    const driverClockIn = doc.data() as DriverAvailability;
    return {
      ...driverClockIn,
      driverId: driverClockIn.driver,
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
