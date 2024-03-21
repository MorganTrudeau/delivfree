import React, { useEffect } from "react";
import { Text } from "./Text";
import { TextStyle, View, ViewProps } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { $row } from "./styles";
import { colors } from "app/theme";

export const LoadingText = ({ style, ...rest }: ViewProps) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: ANIMATION_DURATION }),
        withTiming(2, { duration: ANIMATION_DURATION }),
        withTiming(3, { duration: ANIMATION_DURATION }),
        withTiming(0, { duration: ANIMATION_DURATION * 2 })
      ),
      -1
    );
  }, []);

  const animatedStyleOne = useAnimatedStyle(() => ({
    ...$dotText,
    opacity: interpolate(animation.value, [0, 1], [0, 1]),
  }));
  const animatedStyleTwo = useAnimatedStyle(() => ({
    ...$dotText,
    opacity: interpolate(animation.value, [1, 2], [0, 1]),
  }));
  const animatedStyleThree = useAnimatedStyle(() => ({
    ...$dotText,
    opacity: interpolate(animation.value, [2, 3], [0, 1]),
  }));

  return (
    <View style={[$row, style]} {...rest}>
      <Text preset="heading">Loading</Text>
      <Animated.Text style={animatedStyleOne}>.</Animated.Text>
      <Animated.Text style={animatedStyleTwo}>.</Animated.Text>
      <Animated.Text style={animatedStyleThree}>.</Animated.Text>
    </View>
  );
};

const ANIMATION_DURATION = 400;

const $dotText: TextStyle = {
  color: colors.text,
  fontSize: 36,
  lineHeight: 44,
};
