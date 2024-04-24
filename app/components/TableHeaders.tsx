import { colors, spacing } from "app/theme";
import React from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "./Text";

interface Props {
  headers: { title: string; maxWidth?: number }[];
}

export const TableHeaders = ({ headers }: Props) => {
  return (
    <View style={$header}>
      {headers.map(({ title, maxWidth }) => (
        <View key={title} style={[$tableCell, { maxWidth }]}>
          <Text preset="subheading" size="xs">
            {title}
          </Text>
        </View>
      ))}
    </View>
  );
};

const $header: ViewStyle = {
  paddingVertical: spacing.xs,
  flexDirection: "row",
  alignItems: "center",
  borderTopWidth: 1,
  borderTopColor: colors.border,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderLight,
};

const $tableCell: ViewStyle = {
  flex: 1,
  paddingEnd: spacing.md,
};
