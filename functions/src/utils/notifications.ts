import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { BaseMessage } from "firebase-admin/lib/messaging/messaging-api";
import {
  Driver,
  Order,
  User,
  VENDOR_DOMAIN,
  Vendor,
  VendorLocation,
} from "../types";
import { sendEmailNotification } from "./email";
import { formatOrderEmail } from "./orders";

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

export async function sendOrderCompleteNotification(order: Order) {
  const userDoc = await admin
    .firestore()
    .collection("Users")
    .doc(order.customer)
    .get();
  const user = userDoc.data() as User | undefined;

  if (!user) {
    return true;
  }

  const userNotification = {
    title: "Order Complete",
    body: `Enjoy your meal. Thank you for ordering with DelivFree!`,
  };
  const userData = {
    orderId: order.id,
    type: "order_complete",
  };
  const userCollapseKey = "orderComplete";
  const userLink = `${VENDOR_DOMAIN}`;
  const userPayload = buildMessagePayload(
    userNotification,
    userData,
    userCollapseKey,
    userLink
  );
  await sendNotifications([user.id], userPayload);
  await sendEmailNotification({
    ...userNotification,
    to: [user.email],
  });

  return true;
}

export async function sendOrderArrivedNotification(order: Order) {
  const userDoc = await admin
    .firestore()
    .collection("Users")
    .doc(order.customer)
    .get();
  const user = userDoc.data() as User | undefined;

  if (!user) {
    return true;
  }

  const userNotification = {
    title: "Order Arrived",
    body: `Hope you're hungry. Your order is here!`,
  };
  const userData = {
    orderId: order.id,
    type: "order_arrived",
  };
  const userCollapseKey = "orderArrived";
  const userLink = `${VENDOR_DOMAIN}`;
  const userPayload = buildMessagePayload(
    userNotification,
    userData,
    userCollapseKey,
    userLink
  );
  await sendNotifications([user.id], userPayload);
  await sendEmailNotification({
    ...userNotification,
    to: [user.email],
  });

  return true;
}

export async function sendNewOrderNotification(order: Order) {
  const vendorDoc = await admin
    .firestore()
    .collection("Vendors")
    .doc(order.vendor)
    .get();
  const vendor = vendorDoc.data() as Vendor | undefined;

  if (!vendor) {
    functions.logger.log("missing-vendor");
    return true;
  }

  const vendorOwners = vendor.users;

  const vendorNotification = {
    title: "New Order",
    body: `A new order has been placed`,
  };
  const vendorData = {
    orderId: order.id,
    type: "order_created",
  };
  const vendorCollapseKey = "orderCreated";
  const vendorLink = `${VENDOR_DOMAIN}?route=orders`;
  const vendorPayload = buildMessagePayload(
    vendorNotification,
    vendorData,
    vendorCollapseKey,
    vendorLink
  );
  await sendNotifications(vendorOwners, vendorPayload);
  await sendEmailNotification({
    ...vendorNotification,
    to: [vendor.email],
  });

  const userDoc = await admin
    .firestore()
    .collection("Users")
    .doc(order.customer)
    .get();
  const user = userDoc.data() as User | undefined;

  if (!user) {
    functions.logger.log("missing-user");
    return true;
  }

  const vendorLocationDoc = await admin
    .firestore()
    .collection("VendorLocations")
    .doc(order.vendorLocation)
    .get();
  const vendorLocation = vendorLocationDoc.data() as VendorLocation | undefined;

  if (!vendorLocation) {
    functions.logger.log("missing-vendor-location");
    return true;
  }

  const userNotification = {
    title: "Order Placed",
    body: `Your order is now in progress`,
  };
  const userData = {
    orderId: order.id,
    type: "new_order",
  };
  const userCollapseKey = "orderCreated";
  const userLink = `${VENDOR_DOMAIN}?route=orders`;
  const userPayload = buildMessagePayload(
    userNotification,
    userData,
    userCollapseKey,
    userLink
  );
  await sendNotifications([user.id], userPayload);
  await sendEmailNotification({
    title: "Order Placed",
    html: formatOrderEmail(order, vendorLocation),
    to: [user.email],
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
    to: [driver.email],
  });
}

export async function sendVendorPositionFilledNotification(vendor: string) {
  const vendorDoc = await admin
    .firestore()
    .collection("Vendors")
    .doc(vendor)
    .get();

  const vendorData = vendorDoc.data() as Vendor | undefined;

  if (!vendorData) {
    return;
  }

  const notification = {
    title: "Position Filled",
    body: "A driver has been found for your posted position.",
  };
  const data = {
    type: "license_approved",
  };
  const collapseKey = "license_approved";
  const link = `${VENDOR_DOMAIN}`;
  const payload = buildMessagePayload(notification, data, collapseKey, link);
  await sendNotifications(vendorData.users, payload);

  await sendEmailNotification({
    ...notification,
    body: "A driver has been found for your posted position. Please visit https://business.delivfree.com to activate your driver.\n\nRegards,\n\nDelivFree Canada Inc.",
    to: [vendorData.email],
  });
}

export async function sendDriverLicenseApprovedNotification(driver: string) {
  const driverDoc = await admin
    .firestore()
    .collection("Drivers")
    .doc(driver)
    .get();
  const driverData = driverDoc.data() as Driver | undefined;

  if (!driverData) {
    return;
  }

  const notification = {
    title: "License Approved",
    body: "Your license application has been approved.",
  };
  const data = {
    type: "license_approved",
  };
  const collapseKey = "new_application";
  const link = `${VENDOR_DOMAIN}`;
  const payload = buildMessagePayload(notification, data, collapseKey, link);
  await sendNotifications([driverData.user], payload);

  await sendEmailNotification({
    ...notification,
    body: "Your license application has been approved. Please visit https://business.delivfree.com to activate your license.\n\nRegards,\n\nDelivFree Canada Inc.",
    to: [driverData.email],
  });
}
