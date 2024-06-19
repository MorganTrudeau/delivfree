import * as admin from "firebase-admin";
import { BaseMessage } from "firebase-admin/lib/messaging/messaging-api";

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

  console.log("Sending notifications");
  console.log("User ids", userIds);
  console.log("Device tokens", deviceTokens);

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
