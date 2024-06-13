import React, { useContext, useEffect } from "react";
import {
  Platform,
  Pressable,
  PressableProps,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { isRTL } from "../i18n";
import { colors, spacing } from "../theme";
import { DrawerContext } from "./Drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DrawerIconButton(props: PressableProps) {
  const { ...PressableProps } = props;

  const { drawerRef, open } = useContext(DrawerContext);

  const progress = useSharedValue(0);

  const insets = useSafeAreaInsets();

  const toggleDrawer = () => {
    if (!open) {
      drawerRef.current?.openDrawer({ speed: 2 });
    } else {
      drawerRef.current?.closeDrawer({ speed: 2 });
    }
  };

  const inset = isRTL ? insets.right : insets.left;

  const animatedContainerStyles = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [0, isRTL ? 60 + inset : -(60 + inset)]
    );

    return {
      transform: [{ translateX }],
    };
  }, [inset, progress]);

  const animatedTopBarStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.text, colors.tint]
    );
    const marginStart = interpolate(progress.value, [0, 1], [0, -11.5]);
    const rotate = interpolate(progress.value, [0, 1], [0, isRTL ? 45 : -45]);
    const marginBottom = interpolate(progress.value, [0, 1], [0, -2]);
    const width = interpolate(progress.value, [0, 1], [18, 12]);

    return {
      backgroundColor,
      marginStart,
      marginBottom,
      width,
      transform: [{ rotate: `${rotate}deg` }],
    };
  }, [progress]);

  const animatedMiddleBarStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.text, colors.tint]
    );
    const width = interpolate(progress.value, [0, 1], [18, 16]);

    return {
      backgroundColor,
      width,
    };
  }, [progress]);

  const animatedBottomBarStyles = useAnimatedStyle(() => {
    const marginTop = interpolate(progress.value, [0, 1], [4, 2]);
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.text, colors.tint]
    );
    const marginStart = interpolate(progress.value, [0, 1], [0, -11.5]);
    const rotate = interpolate(progress.value, [0, 1], [0, isRTL ? -45 : 45]);
    const width = interpolate(progress.value, [0, 1], [18, 12]);

    return {
      backgroundColor,
      marginStart,
      width,
      marginTop,
      transform: [{ rotate: `${rotate}deg` }],
    };
  }, [progress]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      progress.value = withTiming(open ? 1 : 0);
    }
  }, [open, progress]);

  return (
    <AnimatedPressable
      {...PressableProps}
      onPress={toggleDrawer}
      style={[$container, animatedContainerStyles]}
      hitSlop={30}
    >
      <Animated.View style={[$topBar, animatedTopBarStyles]} />

      <Animated.View style={[$middleBar, animatedMiddleBarStyles]} />

      <Animated.View style={[$bottomBar, animatedBottomBarStyles]} />
    </AnimatedPressable>
  );
}

const barHeight = 2;

const $container: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  width: 56,
};

const $topBar: ViewStyle = {
  height: barHeight,
};

const $middleBar: ViewStyle = {
  height: barHeight,
  marginTop: spacing.xxs,
};

const $bottomBar: ViewStyle = {
  height: barHeight,
};
