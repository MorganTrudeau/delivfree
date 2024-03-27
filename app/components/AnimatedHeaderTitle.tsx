import React from "react";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "./Text";

interface Props {
  title: string | null | undefined;
  scrollY: SharedValue<number>;
}

const AnimatedHeaderTitle = ({ title, scrollY }: Props) => {
  const visible = useDerivedValue(
    () => withTiming(scrollY.value > 33 ? 1 : 0),
    []
  );
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: interpolate(visible.value, [0, 1], [10, 0]) }],
      opacity: visible.value,
    }),
    []
  );
  return (
    <Animated.View style={animatedStyle}>
      <Text weight={"bold"}>{title}</Text>
    </Animated.View>
  );
};

export default AnimatedHeaderTitle;
