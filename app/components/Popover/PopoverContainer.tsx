import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import React from "react";
import { Pressable, ViewStyle } from "react-native";

export const PopoverContainer = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  return (
    <Pressable
      style={[
        {
          backgroundColor: colors.background,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs,
          borderRadius: borderRadius.md,
          minWidth: 250,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};
