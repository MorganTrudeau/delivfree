import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";

export const DetailItem = ({
  title,
  value,
  onPress,
}: {
  title: string;
  value: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable style={{ marginTop: spacing.xxs }} onPress={onPress}>
      <Text preset="semibold" size={"xs"}>
        {title}
      </Text>
      <Text
        style={{ color: onPress ? colors.primary : colors.text }}
        selectable
      >
        {value}
      </Text>
    </Pressable>
  );
};
