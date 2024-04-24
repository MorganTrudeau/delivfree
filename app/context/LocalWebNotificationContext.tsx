import React, { createContext, useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import { shallowEqual } from "react-redux";
import { FCMMessage } from "app/utils/notifications";
import { isWebNotificationsSupported } from "app/utils/general";
import { getWebNotificationPermission } from "app/utils/firebase";
import AskMessagingPermission from "app/components/LocalWebNotifications/AskMessagingPermission";
import LocalWebNotificationList from "app/components/LocalWebNotifications/LocalWebNotificationList";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { setWebNotificationsEnabled } from "app/redux/reducers/appConfig";

const TEST_NOTIFICATIONS = [
  {
    notification: {
      title: "Test Message",
      body: "Testing a long body message to see what happens in the formatting of the notification UI",
    },
    fcmMessageId: 1,
  },
  { notification: { title: "Test Message", body: "2" }, fcmMessageId: 2 },
  { notification: { title: "Test Message", body: "3" }, fcmMessageId: 3 },
];

export const LocalWebNotificationContext = createContext({
  configure: (config = {}) => {},
  localNotification: (notification: FCMMessage) => {},
});

const LocalWebNotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { webNotificationsEnabled, authToken } = useAppSelector(
    (state) => ({
      webNotificationsEnabled: state.appConfig.webNotificationsEnabled,
      authToken: state.auth.authToken,
    }),
    shallowEqual
  );
  const dispatch = useAppDispatch();

  const [onNotification, setOnNotification] =
    useState<(notification: FCMMessage) => void>();
  const [notifications, setNotifications] = useState<FCMMessage[]>([]);
  const [askingPermission, setAskingPermission] = useState(false);

  const handlePermissions = async () => {
    const isSupported = await isWebNotificationsSupported();

    if (!isSupported) {
      return;
    }

    const notificationPermission = getWebNotificationPermission();

    if (notificationPermission === "granted") {
      if (!webNotificationsEnabled) {
        dispatch(setWebNotificationsEnabled(true));
      }
    } else if (notificationPermission === "default") {
      if (!askingPermission) {
        setAskingPermission(true);
      }
    }
  };

  useEffect(() => {
    if (authToken) {
      handlePermissions();
    }
  }, [authToken]);

  const configure = (
    config: { onNotification?: (notification: FCMMessage) => void } = {}
  ) => {
    const { onNotification } = config;
    setOnNotification(() => onNotification);
  };

  const localNotification = (notification: FCMMessage) => {
    console.log("display local");
    setNotifications((_notifications) => [notification, ..._notifications]);
  };

  const handleNotificationPress = (notification: FCMMessage) => {
    if (typeof onNotification === "function") {
      onNotification(notification);
    }
    removeNotification(notification);
  };

  const removeNotification = (notification: FCMMessage) => {
    console.log("remove", notification);
    setNotifications((_notifications) =>
      _notifications.filter(
        (n: FCMMessage) => n.fcmMessageId !== notification.fcmMessageId
      )
    );
  };

  const handleClearAll = () => {
    setNotifications(() => []);
  };

  const handleEnableNotifications = async () => {
    try {
      setAskingPermission(false);
      await messaging().requestPermission();
      if (getWebNotificationPermission() === "granted") {
        dispatch(setWebNotificationsEnabled(true));
      }
    } catch (error) {
      console.log("Enable notifications error", error);
    }
  };

  const handleDisableNotifications = () => {
    setAskingPermission(false);
  };

  return (
    <LocalWebNotificationContext.Provider
      value={{ configure, localNotification }}
    >
      {children}
      {askingPermission && (
        <AskMessagingPermission
          style={{
            position: "absolute",
            top: spacing.lg,
            right: spacing.lg,
          }}
          onEnable={handleEnableNotifications}
          onCancel={handleDisableNotifications}
        />
      )}
      <LocalWebNotificationList
        notifications={notifications}
        notificationPress={handleNotificationPress}
        removeNotification={removeNotification}
        clearAll={handleClearAll}
        style={{ position: "absolute", top: 0, right: 0 }}
      />
    </LocalWebNotificationContext.Provider>
  );
};

export default LocalWebNotificationProvider;
