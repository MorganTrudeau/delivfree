import { translate } from "app/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { generatePin, generateUid } from "app/utils/general";
import {
  AppMessage,
  AppMessageData,
  DeviceNotification,
  FCMMessage,
} from "app/utils/notifications";
import { Platform } from "react-native";

export const isWebNotificationsSupported = () => {
  if (Platform.OS !== "web") {
    return false;
  }
  // @ts-ignore
  return messaging.isSupported();
};

export const getWebNotificationPermission = () => {
  if (window && "Notification" in window) {
    return window.Notification.permission;
  }
  return null;
};

export const formatFCMMessage = (fcmMessage: FCMMessage): AppMessage => {
  const messageId = fcmMessage.messageId || generateUid();
  const title = fcmMessage.notification?.title || "";
  const message = fcmMessage.notification?.body || "";
  const data = fcmMessage.data || ({} as AppMessageData);

  return { id: messageId || generatePin(6), title, message, data };
};

export const formatDeviceNotification = (
  deviceNotification: DeviceNotification
): AppMessage => {
  const { title = "", message, userInfo, data, id } = deviceNotification;

  return {
    id: id || data.id || generatePin(6),
    title,
    message: typeof message === "string" ? message : "",
    data: data || userInfo,
  };
};

const PREFERRED_NOTIFICATION_SETTING = "PREFERRED_NOTIFICATION_SETTING";
export const getPreferredNotificationSetting = async (): Promise<
  string | null | void
> => {
  try {
    return await AsyncStorage.getItem(PREFERRED_NOTIFICATION_SETTING);
  } catch (error) {
    console.log("Failed to save preferred notification setting", error);
  }
};
export const savePreferredNotificationSetting = async () => {
  try {
    return await AsyncStorage.setItem(PREFERRED_NOTIFICATION_SETTING, "TRUE");
  } catch (error) {
    console.log("Failed to save preferred notification setting", error);
  }
};

export function firebaseAuthErrorToMessage(error: unknown) {
  // @ts-ignore
  if (!(error && error.code)) {
    return translate("errors.common");
  }
  // @ts-ignore
  switch (error.code) {
    case "auth/user-not-found":
      return translate("errors.auth_user_not_found");
    case "auth/wrong-password":
      return translate("errors.auth_wrong_password");
    case "auth/invalid-email":
      return translate("errors.auth_invalid_email");
    case "auth/weak-password":
      return translate("errors.auth_weak_password");
    case "auth/email-already-in-use":
      return translate("errors.auth_email_already_in_use");
    case "auth/requires-recent-login":
      return translate("errors.auth_requires-recent-login");
    case "auth/network-request-failed":
      return translate("errors.auth_network-request-failed");
    case "auth/provider-already-linked":
      return translate("errors.already-request-failed");
    case "auth/invalid-credential":
      return translate("errors.invalid-credential");
    default:
      return translate("errors.common");
  }
}
