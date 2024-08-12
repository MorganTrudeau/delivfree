import * as admin from "firebase-admin";
import { BaseMessage } from "firebase-admin/lib/messaging/messaging-api";
import { Driver, Order, VENDOR_DOMAIN, Vendor } from "../types";
import { sendEmailNotification } from "./email";

const webpushImage = "";

export const buildMessagePayload = (
  notification: BaseMessage["notification"],
  data: BaseMessage["data"],
  collapseKey: string,
  link: string
): BaseMessage => {
  return {
    notification,
    android: {
      notification,
      collapseKey,
      priority: "high",
    },
    apns: {
      payload: { aps: { threadId: collapseKey, badge: 1, sound: "default" } },
    },
    webpush: {
      notification: { ...notification, image: webpushImage },
      fcmOptions: {
        link,
      },
    },
    data,
  };
};

export async function getDeviceTokens(userIds: string[]) {
  const deviceTokenMapSnapshots = await Promise.all(
    userIds.map((id) =>
      admin.firestore().collection(`DeviceTokens`).doc(id).get()
    )
  );

  let deviceTokens: string[] = [];

  if (Array.isArray(deviceTokenMapSnapshots)) {
    deviceTokens = deviceTokenMapSnapshots.reduce((acc, mapSnapshot) => {
      const map = mapSnapshot.data() as { [id: string]: string } | null;

      if (map && typeof map === "object") {
        acc = acc.concat(Object.values(map));
      }
      return acc;
    }, [] as string[]);
  }

  return deviceTokens;
}

export async function sendNotifications(
  userIds: string[],
  payload: BaseMessage
) {
  if (!(userIds && userIds.length)) {
    console.log("No users to send notifications to");
    return;
  }

  const deviceTokens = await getDeviceTokens(userIds);

  if (!deviceTokens.length) {
    console.log("Missing device tokens");
    return;
  }

  const messages: admin.messaging.Message[] = deviceTokens.map((token) => ({
    ...payload,
    token,
  }));

  return admin.messaging().sendEach(messages);
}

export async function sendAdminNotifications(payload: BaseMessage) {
  const adminSnap = await admin.firestore().collection("Admins").get();
  const adminIds = adminSnap.docs.map((doc) => doc.id);
  return sendNotifications(adminIds, payload);
}

export async function sendNewOrderNotification(order: Order) {
  const vendorDoc = await admin
    .firestore()
    .collection("Vendors")
    .doc(order.vendor)
    .get();
  const vendor = vendorDoc.data() as Vendor | undefined;

  if (!vendor) {
    return true;
  }

  const vendorOwners = vendor.users;

  const notification = {
    title: "New Order",
    body: `An new order has been placed`,
  };
  const data = {
    orderId: order.id,
    type: "order_created",
  };
  const collapseKey = "orderCreated";
  const link = `${VENDOR_DOMAIN}?route=orders`;
  const payload = buildMessagePayload(notification, data, collapseKey, link);
  await sendNotifications(vendorOwners, payload);
  await sendEmailNotification({
    ...notification,
    from: "admin@delivfree.com",
    to: vendor.email,
  });
  return true;
}

export async function sendOrderDriverAssignedNotification(order: Order) {
  if (!order.driver) {
    return;
  }
  const driverDoc = await admin
    .firestore()
    .collection("Drivers")
    .doc(order.driver)
    .get();
  const driver = driverDoc.data() as Driver | undefined;
  if (!driver) {
    return;
  }
  const userIds = [order.driver];
  const notification = {
    title: "New Order",
    body: `View order details and prepare for delivery.`,
  };
  const data = {
    orderId: order.id,
    type: "order_driver_assigned",
  };
  const collapseKey = "orderCreated";
  const link = `${VENDOR_DOMAIN}?route=orders`;
  const payload = buildMessagePayload(notification, data, collapseKey, link);
  await sendNotifications(userIds, payload);
  await sendEmailNotification({
    ...notification,
    from: "admin@delivfree.com",
    to: driver.email,
  });
}
