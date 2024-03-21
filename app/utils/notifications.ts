import { generateUid } from "./general";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { ReceivedNotification } from "react-native-push-notification";
import { AppMessageTypes, TriviaCategory } from "smarticus";

export const formatFCMMessage = (fcmMessage: FCMMessage): AppMessage => {
  const messageId = fcmMessage.messageId || generateUid();
  const title = fcmMessage.notification?.title || "";
  const message = fcmMessage.notification?.body || "";
  const data = fcmMessage.data || ({} as AppMessageData);

  return { id: messageId, title, message, data };
};

export const formatDeviceNotification = (
  deviceNotification: DeviceNotification
): AppMessage => {
  const { title = "", message, userInfo, data, id } = deviceNotification;

  return {
    id: id || data.id || generateUid(),
    title,
    message: typeof message === "string" ? message : "",
    data: data || userInfo,
  };
};

export type DeviceNotification = ReceivedNotification & {
  title?: string;
};

export type FCMMessage = FirebaseMessagingTypes.RemoteMessage & {
  fcmMessageId?: string;
};

export type AppMessageData = {
  type?: LinkMessageType;
  challengeId?: string;
  category?: TriviaCategory;
  localNotification?: boolean;
};

export type AppMessage = {
  id: string;
  title: string;
  message: string;
  data: AppMessageData;
};

export type LinkMessageType =
  (typeof AppMessageTypes)[keyof typeof AppMessageTypes];

export type LegacyPushSettings = {
  employees: { [id: string]: boolean };
};

export type PushSettings = {
  notes: string[];
  taskCompleted: string[];
  workDaySubmit: string[];
  workDaySubmitEmployees: { [id: string]: string[] };
};

export type UserPushSettings =
  | {
      [Property in keyof PushSettings]: PushSettings[Property] extends string[]
        ? boolean
        : { [userId: string]: boolean };
    };
