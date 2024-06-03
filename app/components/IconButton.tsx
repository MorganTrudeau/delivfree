import React from "react";
import { Pressable, PressableProps, StyleSheet, ViewStyle } from "react-native";
import { Icon, IconProps } from "./Icon";
import { colors, spacing } from "app/theme";

type Props = PressableProps & Pick<IconProps, "icon" | "color" | "size">;

export const IconButton = ({ icon, size, color, ...rest }: Props) => {
  return (
    <Pressable {...rest} style={$button}>
      <Icon icon={icon} size={size} color={color} />
    </Pressable>
  );
};

const $button: ViewStyle = {
  padding: spacing.xxxs,
  borderRadius: 5,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border,
  backgroundColor: colors.background,
};
