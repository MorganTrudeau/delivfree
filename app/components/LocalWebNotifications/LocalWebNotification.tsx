import { FCMMessage } from "app/utils/notifications";
import React, { useState, useRef, useMemo } from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  $shadow,
  WEB_NOTIFICATION_HEIGHT,
  WEB_NOTIFICATION_WIDTH,
} from "../styles";
import { colors } from "app/theme";
import { Text } from "../Text";
import { ModalCloseButton } from "../Modal/ModalCloseButton";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

type Props = {
  notification: FCMMessage;
  onPress: (notification: FCMMessage) => void;
  onClose: (notification: FCMMessage) => void;
  overlayOpacity?: number;
  totalNotifications: number;
  isFirst: boolean;
  showAll: boolean;
  showAllAnimation: SharedValue<number>;
  notificationsLength: number;
  index: number;
};

const LocalWebNotification = ({
  notification,
  onPress,
  onClose,
  overlayOpacity = 0,
  totalNotifications,
  showAllAnimation,
  isFirst,
  showAll,
  notificationsLength,
  index,
}: Props) => {
  const overlapIndex = Math.min(index, 2);

  const style = useAnimatedStyle(
    () => ({
      zIndex: 9999 - index,
      transform: [
        {
          translateY: interpolate(
            showAllAnimation.value,
            [0, 1],
            [index * -(WEB_NOTIFICATION_HEIGHT + 20) + overlapIndex * 10, 0]
          ),
        },
      ],
      height: interpolate(
        showAllAnimation.value,
        [0, 1],
        [
          notificationsLength > 1
            ? WEB_NOTIFICATION_HEIGHT + 20
            : WEB_NOTIFICATION_HEIGHT,
          WEB_NOTIFICATION_HEIGHT,
        ]
      ),
      width: interpolate(
        showAllAnimation.value,
        [0, 1],
        [overlapIndex * -24 + WEB_NOTIFICATION_WIDTH, WEB_NOTIFICATION_WIDTH]
      ),
      marginBottom: interpolate(showAllAnimation.value, [0, 1], [0, 7]),
    }),
    [showAllAnimation]
  );

  const { body, title } = useMemo(() => {
    if (notification.notification) {
      console.log(notification.notification);
      return notification.notification;
    }
    return { body: "", title: "" };
  }, [notification]);

  const hovered = useSharedValue(0);
  const handleHover = (_hovered: boolean) => () => {
    if (!(isFirst || showAll)) {
      return;
    }
    hovered.value = withTiming(_hovered ? 1 : 0);
  };

  const animatedStyle = useAnimatedStyle(
    () => ({ transform: [{ scale: hovered.value }] }),
    [hovered]
  );

  return (
    <AnimatedTouchableOpacity
      //@ts-ignore
      onMouseEnter={handleHover(true)}
      onMouseLeave={handleHover(false)}
      activeOpacity={1}
      style={[
        $shadow,
        {
          backgroundColor: colors.background,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 10,
          height: WEB_NOTIFICATION_HEIGHT,
          width: WEB_NOTIFICATION_WIDTH,
        },
        style,
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={{ flex: 1 }}>
        <Text preset="bold" style={{ marginBottom: 3 }}>
          {title}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={{ flexShrink: 1 }}
        >
          {body}
        </Text>
        {totalNotifications > 1 && isFirst && !showAll && (
          <Text size="xs" style={{ marginTop: 8, color: colors.textDim }}>
            {totalNotifications - 1} more{" "}
            {totalNotifications > 2 ? "notifications" : "notification"}
          </Text>
        )}
      </View>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 4,
            left: -5,
          },
          animatedStyle,
        ]}
      >
        <ModalCloseButton
          onPress={() => onClose(notification)}
          style={{ alignSelf: "flex-start" }}
        />
      </Animated.View>
      <View
        style={{
          backgroundColor: "black",
          opacity: overlayOpacity,
          position: "absolute",
          borderRadius: 10,
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        pointerEvents={"none"}
      />
    </AnimatedTouchableOpacity>
  );
};

export default LocalWebNotification;
