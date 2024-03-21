import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { Icon } from "../Icon";
import { spacing } from "app/theme";
import { sizing } from "app/theme/sizing";

export const ModalCloseButton = ({
  onPress,
}: {
  onPress: (() => void) | undefined;
}) => {
  return (
    <Pressable onPress={onPress} style={$style} hitSlop={spacing.sm}>
      <Icon icon="close" size={sizing.md} />
    </Pressable>
  );
};

const $style: ViewStyle = {
  position: "absolute",
  top: spacing.xs,
  right: spacing.xs,
};
