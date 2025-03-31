import { colors, spacing } from "app/theme";
import React, { memo, useCallback } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { ShadowDecorator } from "react-native-draggable-flatlist";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "../Icon";
import { $borderBottomLight, $flex, $row } from "../styles";

export const DraggableItem = memo(function Item({
  drag,
  isActive,
  outerStyle,
  innerStyle,
  children,
}: {
  drag: () => void;
  isActive?: boolean;
  outerStyle?: StyleProp<ViewStyle>;
  innerStyle?: ViewStyle;
  children: React.ReactNode;
}) {
  const activeAnimation = useSharedValue(isActive ? 1 : 0);
  const animatedStyle = useAnimatedStyle(
    () => ({
      borderBottomColor: interpolateColor(
        activeAnimation.value,
        [0, 1],
        [colors.border, "transparent"],
        "HSV"
      ),
    }),
    [isActive]
  );
  const onPressIn = useCallback(() => {
    activeAnimation.value = withTiming(1, { duration: 100 });
    drag();
  }, [activeAnimation, drag]);
  const onPressOut = useCallback(() => {
    activeAnimation.value = withTiming(0);
  }, [activeAnimation]);
  return (
    <ShadowDecorator>
      <Pressable
        style={[outerStyle, $outer, $row]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Icon icon={"drag-vertical"} style={$icon} />
        <Animated.View
          style={[innerStyle, $borderBottomLight, $flex, animatedStyle]}
        >
          {children}
        </Animated.View>
      </Pressable>
    </ShadowDecorator>
  );
});

const $outer: ViewStyle = { backgroundColor: colors.background };
const $icon: ViewStyle = { marginRight: spacing.xs };
