import React, { useEffect } from "react";
import { Icon } from "./Icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, spacing } from "app/theme";
import { Text } from "./Text";
import { Button } from "./Button";
import { View } from "react-native";

export const PaymentSuccess = ({
  title,
  message,
  onButtonPress,
  buttonTitle,
}: {
  title: string;
  message?: string;
  onButtonPress?: () => void;
  buttonTitle?: string;
}) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withTiming(1);
  }, []);

  const style = useAnimatedStyle(
    () => ({
      flex: 1,
      justifyContent: "flex-start",
      transform: [
        { translateY: interpolate(animation.value, [0, 1], [15, 0]) },
      ],
    }),
    [animation]
  );

  return (
    <Animated.View style={style}>
      <View
        style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}
      >
        <Icon icon="check" color={colors.success} size={80} />
        <Text preset="semibold" size={"md"} style={{ marginTop: spacing.sm }}>
          {title}
        </Text>
        {!!message && <Text>{message}</Text>}
        {onButtonPress && !!buttonTitle && (
          <Button
            text={buttonTitle}
            style={{ alignSelf: "stretch", marginTop: spacing.md }}
            preset="reversed"
            onPress={onButtonPress}
          />
        )}
      </View>
    </Animated.View>
  );
};
