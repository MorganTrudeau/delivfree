import React, { useState, useRef } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { FCMMessage } from "app/utils/notifications";
import { useDimensions } from "app/hooks/useDimensions";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LocalWebNotification from "./LocalWebNotification";
import {
  $shadowWhite,
  WEB_NOTIFICATION_HEIGHT,
  WEB_NOTIFICATION_WIDTH,
} from "../styles";
import { ButtonSmall } from "../ButtonSmall";
import { spacing } from "app/theme";

const PADDING = 10;

type Props = {
  notifications: FCMMessage[];
  notificationPress: (notification: FCMMessage) => void;
  removeNotification: (notification: FCMMessage) => void;
  clearAll: () => void;
  style?: StyleProp<ViewStyle>;
};

const LocalWebNotificationList = ({
  notifications,
  notificationPress,
  removeNotification,
  clearAll,
  style,
}: Props) => {
  const { height } = useDimensions();
  const maxHeight = height - 100;

  const [showAll, setShowAll] = useState(false);
  const showAllTransition = useSharedValue(0);

  const handleShowAll = () => {
    showAllTransition.value = withTiming(1);
    setShowAll(true);
  };
  const handleShowLess = () => {
    showAllTransition.value = withTiming(0);
    setShowAll(false);
  };

  const hasMoreNotifications = notifications.length > 1;

  const staticUnderlayHeight = (hasMoreNotifications ? 40 : 0) + PADDING * 2;

  const lastNoficationsLength = useRef(notifications.length);
  const moreNotificationsTransition = useSharedValue(
    hasMoreNotifications ? 1 : 0
  );

  if (
    (lastNoficationsLength.current === 1 && hasMoreNotifications) ||
    (lastNoficationsLength.current > 1 && notifications.length <= 1)
  ) {
    moreNotificationsTransition.value = withTiming(
      hasMoreNotifications ? 1 : 0
    );
    if (showAll && notifications.length === 1) {
      handleShowLess();
    }
  }
  lastNoficationsLength.current = notifications.length;

  const buttonsStyle = useAnimatedStyle(
    () => ({
      opacity: moreNotificationsTransition.value,
      height: interpolate(moreNotificationsTransition.value, [0, 1], [0, 40]),
    }),
    [moreNotificationsTransition]
  );
  const underlayStyle = useAnimatedStyle(
    () => ({
      height: interpolate(
        showAllTransition.value,
        [0, 1],
        [
          staticUnderlayHeight +
            (hasMoreNotifications
              ? WEB_NOTIFICATION_HEIGHT +
                20 +
                Math.min(notifications.length - 1, 2) * 10
              : WEB_NOTIFICATION_HEIGHT), // Account for messages translated below top message
          Math.min(
            maxHeight,
            staticUnderlayHeight +
              (WEB_NOTIFICATION_HEIGHT + 7) * notifications.length +
              -7 // height plus margin
          ), // remove last margin
        ]
      ),
    }),
    [showAllTransition]
  );

  return (
    <View
      style={[{ margin: 10 }, style]}
      pointerEvents={notifications.length ? "auto" : "none"}
    >
      {!!notifications.length && (
        <Animated.View
          style={[
            $shadowWhite,
            {
              borderRadius: 10,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 1,
            },
            underlayStyle,
          ]}
          pointerEvents={"none"}
        />
      )}

      <ScrollView
        style={{ zIndex: 2, flex: 1, maxHeight }}
        contentContainerStyle={{
          padding: PADDING,
          alignItems: "center",
          zIndex: 2,
          flexGrow: 1,
        }}
      >
        <Animated.View
          style={[
            {
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              width: "100%",
              overflow: "hidden",
            },
            buttonsStyle,
          ]}
        >
          <ButtonSmall
            text={"Clear all"}
            onPress={clearAll}
            style={{
              marginRight: 10,
              paddingVertical: spacing.xxs,
              minHeight: 0,
            }}
          />
          <ButtonSmall
            text={showAll ? "Show less" : "Show all"}
            onPress={showAll ? handleShowLess : handleShowAll}
            style={{
              paddingVertical: spacing.xxs,
              minHeight: 0,
            }}
          />
        </Animated.View>

        {notifications.map((notification, index) => {
          if (!showAll && index > 3) {
            return null;
          }

          const overlayOpacity = showAll ? 0 : Math.min(index, 2) * 0.05;
          return (
            <LocalWebNotification
              key={`${notification.fcmMessageId}-${index}`}
              notification={notification}
              onPress={notificationPress}
              onClose={removeNotification}
              overlayOpacity={overlayOpacity}
              totalNotifications={notifications.length}
              isFirst={index === 0}
              showAll={showAll}
              index={index}
              notificationsLength={notifications.length}
              showAllAnimation={showAllTransition}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default LocalWebNotificationList;
