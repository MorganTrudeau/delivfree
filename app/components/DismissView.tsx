import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { StyleSheet, TouchableWithoutFeedback, ViewStyle } from "react-native";
import { spacing } from "app/theme";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type DismissViewRef = {
  show: () => void;
  dismiss: (callback?: () => void) => void;
};

type Props = {
  children: React.ReactElement | React.ReactElement[];
  onDismiss?: () => void;
  opacity?: number;
  style?: ViewStyle;
};

const defaultStyle = {};
const defaultOnDismiss = () => null;

const DismissView = (
  {
    children,
    onDismiss = defaultOnDismiss,
    opacity,
    style = defaultStyle,
  }: Props,
  ref: React.Ref<DismissViewRef> | undefined
) => {
  const animation = useSharedValue(0);
  const animating = useRef(false);

  const onAnimationStart = () => {
    animating.current = true;
  };
  const onAnimationEnd = () => {
    animating.current = false;
  };

  const show = () => {
    if (animating.current) return;

    onAnimationStart();
    animation.value = withTiming(
      1,
      {
        duration: 300,
      },
      () => {
        runOnJS(onAnimationEnd)();
      }
    );
  };

  const dismiss = (
    callback: () => void = () => {
      // noop
    }
  ) => {
    if (animating.current) return;
    onAnimationStart();
    animation.value = withTiming(
      0,
      {
        duration: 300,
      },
      () => {
        runOnJS(onAnimationEnd)();
        runOnJS(onDismiss)();
        runOnJS(callback)();
      }
    );
  };

  useImperativeHandle(ref, () => ({ show, dismiss }));

  const containerStyle = useAnimatedStyle(
    () => ({
      ...style,
      ...StyleSheet.absoluteFillObject,
      backgroundColor: `rgba(0,0,0,${opacity || 0.3})`,
      opacity: animation.value,
    }),
    []
  );

  const childContainerStyle = useAnimatedStyle(
    () => ({
      ...$childContainer,
      opacity: animation.value,
      transform: [
        {
          translateY: interpolate(animation.value, [0, 1], [10, 0]),
        },
      ],
    }),
    []
  );

  return (
    <TouchableWithoutFeedback onPress={() => dismiss()}>
      <Animated.View style={containerStyle}>
        <Animated.View style={childContainerStyle}>{children}</Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const $childContainer: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.xl,
};

export default forwardRef(DismissView);
