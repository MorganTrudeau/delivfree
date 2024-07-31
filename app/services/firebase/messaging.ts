import { useContext, useEffect, useRef } from "react";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import PushNotification, { Importance } from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {
  formatDeviceNotification,
  formatFCMMessage,
  DeviceNotification,
  FCMMessage,
  AppMessage,
} from "../../utils/notifications";
import { requestNotifications } from "react-native-permissions";
import firestore from "@react-native-firebase/firestore";
import { getUniqueId } from "react-native-device-info";
import { colors } from "app/theme";
import { useAppSelector } from "app/redux/store";
import { isWebNotificationsSupported } from "app/utils/general";
import { LocalWebNotificationContext } from "app/context/LocalWebNotificationContext";
import { AppMessageTypes } from "delivfree";
import { navigationRef } from "app/navigators";

export const LOCAL_NOTIFICATION_CHANNEL = "local_notifications";

export const FirebaseMessaging = () => {
  const authToken = useAppSelector((state) => state.auth.authToken);
  // const previousAuthToken = useAppSelector((state) => state.auth.previousAuthToken)
  // Listener unsubscribe functions
  const unsubscribeForeground = useRef<() => void>();
  const unsubscribeBackground = useRef<() => void>();
  const unsubscribeToken = useRef<() => void>();
  const recentMessages = useRef(new Set<string>());

  const localWebNotification = useContext(LocalWebNotificationContext);

  // Called once on app first mount
  // Register device for remote notifications
  // Unregister device to notifications on app dismount
  // useEffect(() => {
  //   if (Platform.OS !== "web") {
  //     messaging().registerDeviceForRemoteMessages()
  //   }
  // }, [])

  // Subscribe to notifications on login
  // Unsubscribe to notifications on logout and app quit
  useEffect(() => {
    handleMessagingLifecycle();
  }, [authToken]);

  const handleMessagingLifecycle = async () => {
    if (Platform.OS === "web") {
      const isSupported = await isWebNotificationsSupported();
      if (!isSupported) return;
    }

    if (authToken) {
      initiateMessaging();
    } else {
      stopMessaging();
    }
  };

  // Request permissions
  // Subscribe to token
  // Handle initial token
  // Subscribe to foreground and background messages
  const initiateMessaging = async () => {
    if (Platform.OS === "android") {
      PushNotification.createChannel(
        {
          channelId: LOCAL_NOTIFICATION_CHANNEL, // (required)
          channelName: "Local Notifications", // (required)
          channelDescription: "A channel to show local notifications", // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => {
          console.log("Channel created", created);
        }
      );
    }

    await requestPermission();
    await manageToken();
    await handleInitialNotification();
    subscribeToForegroundMessages();
    subscribeToBackgroundNotifications();
    clearChatNotifications();
  };

  const requestPermission = async () => {
    try {
      if (Platform.OS === "android") {
        await requestNotifications(["alert", "badge", "sound"]);
      } else {
        await messaging().requestPermission();
      }
    } catch (error) {
      console.log("Request permission", error);
    }
  };

  const registerToken = async (deviceToken: string) => {
    const deviceId = Platform.OS === "web" ? "web" : await getUniqueId();
    if (!deviceToken) {
      return;
    }
    return firestore()
      .collection("DeviceTokens")
      .doc(authToken)
      .set({ [deviceId]: deviceToken }, { merge: true });
  };

  // const unRegisterToken = () => {
  //   if (!previousAuthToken) {
  //     return
  //   }
  //   const deviceId = getDeviceId()
  //   return firestore()
  //     .collection("DeviceTokens")
  //     .doc(previousAuthToken)
  //     .set({ [deviceId]: firestore.FieldValue.delete() }, { merge: true })
  // }

  // Get initial token and token updates and register token on database
  const manageToken = async (attempts = 0): Promise<void> => {
    // Get initial token
    try {
      const token = await messaging().getToken();

      if (!token) {
        throw new Error("missing_token");
      } else {
        console.log("Messaging token found!");
        registerToken(token);
      }
    } catch (error) {
      console.log("Manage token error", error);
      if (attempts < 4) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return manageToken(attempts + 1);
      }
    }

    // Unsubscribe to current listener
    if (typeof unsubscribeToken.current === "function") {
      unsubscribeToken.current();
    }
    // Listen to token updates
    unsubscribeToken.current = messaging().onTokenRefresh(registerToken);
  };

  // Get initial token on app first open
  const handleInitialNotification = async () => {
    if (Platform.OS === "web") {
      return;
    }

    const initialNotification: FCMMessage | null =
      await messaging().getInitialNotification();

    !!initialNotification &&
      handleMessage(formatFCMMessage(initialNotification));
  };

  const subscribeToForegroundMessages = () => {
    // Unsubscribe current listener
    if (typeof unsubscribeForeground.current === "function") {
      console.log("Unsubscribing from foreground notifications");
      unsubscribeForeground.current();
    }

    try {
      // Subscribe to foreground messages
      unsubscribeForeground.current =
        messaging().onMessage(onForegroundMessage);
      console.log("Subscribed to foreground notifications");
    } catch (error) {
      console.log("Forground notification subscription error", error);
      return;
    }

    if (Platform.OS === "web") {
      localWebNotification.configure({
        onNotification: (notification: FCMMessage) => {
          const linkMessage: AppMessage = formatFCMMessage(notification);
          handleMessage(linkMessage);
        },
      });
    } else {
      // Subscribe to foreground message tapped event
      PushNotification.configure({
        // @ts-ignore
        onNotification: (notification: DeviceNotification) => {
          const linkMessage: AppMessage =
            formatDeviceNotification(notification);
          if (
            linkMessage.data?.localNotification ||
            (notification.foreground && notification.userInteraction)
          ) {
            handleMessage(linkMessage);
          }
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        popInitialNotification: false,
      });
    }
  };

  // Display local notification
  const onForegroundMessage = (remoteMessage: FCMMessage) => {
    if (!remoteMessage || remoteMessage.data?.["af-uinstall-tracking"]) {
      return;
    }
    const linkMessage = formatFCMMessage(remoteMessage);

    const { data, message, title, id } = linkMessage;
    const messageId = Platform.select({
      default: remoteMessage.messageId,
      web: remoteMessage.fcmMessageId,
    });

    console.log("REMOTE MESSAGE", remoteMessage);

    // Preventing duplicate messages
    if (messageId) {
      if (recentMessages.current.has(messageId)) {
        return;
      } else {
        recentMessages.current.add(messageId);
      }
    }

    const blacklistedMessages = ["challenge-update"];

    if (data.type && blacklistedMessages.includes(data.type)) {
      return;
    }

    if (Platform.OS === "web") {
      localWebNotification.localNotification(remoteMessage);
    } else {
      PushNotification.localNotification({
        channelId: LOCAL_NOTIFICATION_CHANNEL,
        title,
        message,
        userInfo: { ...data, id, localNotification: true },
        smallIcon: "ic_notification",
        color: colors.palette.primary600,
      });
    }
  };

  const subscribeToBackgroundNotifications = () => {
    if (Platform.OS === "web") {
      return;
    }
    // Unsubscribe current listener
    if (typeof unsubscribeBackground.current === "function") {
      unsubscribeBackground.current();
    }
    // Subscribe to background messages
    unsubscribeBackground.current = messaging().onNotificationOpenedApp(
      (remoteMessage: FCMMessage) =>
        handleMessage(formatFCMMessage(remoteMessage))
    );
  };

  // Handle message event
  const handleMessage = async (message: AppMessage) => {
    const { data } = message;

    switch (data.type) {
      case AppMessageTypes.ORDER_DRIVER_ASSIGNED:
      case AppMessageTypes.NEW_ORDER:
        navigationRef.current?.navigate("Orders");
        break;
    }
  };
  // Unsubscribe to background and foreground messages
  // Unsubscribe to token updates
  // Delete token on firebase and database
  const stopMessaging = () => {
    !!unsubscribeForeground.current && unsubscribeForeground.current();
    !!unsubscribeBackground.current && unsubscribeBackground.current();
    !!unsubscribeToken.current && unsubscribeToken.current();
    // unRegisterToken()
  };

  // Clear notifications when app is active
  //   const clearNotifications = (notificationType: string) => {
  //     if (AppState.currentState === "background" || Platform.OS !== "ios") return;

  //     PushNotificationIOS.getDeliveredNotifications((notifications) => {
  //       const removedNotifications: string[] = [];
  //       notifications.forEach((notification) => {
  //         const currentNotificationType = notification.userInfo.type;
  //         if (currentNotificationType === notificationType) {
  //           removedNotifications.push(notification.identifier);
  //         }
  //       });
  //       PushNotificationIOS.removeDeliveredNotifications(removedNotifications);
  //     });
  //   };

  /**
   * To remove notifications.
   * Calls when user enter a chat.
   */
  const clearChatNotifications = (id?: string) => {
    if (Platform.OS !== "ios") return;

    PushNotificationIOS.getDeliveredNotifications((notifications) => {
      const removedNotifications: string[] = [];
      let clearBadge = true;
      notifications.forEach((notification) => {
        const chatId = notification.userInfo.chatId;
        if (typeof chatId === "string") {
          if (chatId && chatId === id) {
            removedNotifications.push(notification.identifier);
          } else if (
            notification.userInfo?.type === "announcement_added" ||
            notification.userInfo?.type === "chat_message_received"
          ) {
            clearBadge = false;
          }
        }
      });
      if (removedNotifications.length) {
        PushNotificationIOS.removeDeliveredNotifications(removedNotifications);
      }
      if (clearBadge) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  };

  // Not rendering any component
  return null;
};
