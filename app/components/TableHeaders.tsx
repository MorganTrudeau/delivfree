import { colors, spacing } from "app/theme";
import React from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "./Text";

export interface TableHeader {
  value?: string;
  visible?: boolean;
  title: string;
  maxWidth?: number;
}
export interface Props {
  headers: TableHeader[];
  style?: ViewStyle;
}

export const TableHeaders = ({ headers, style }: Props) => {
  return (
    <View style={[$header, style]}>
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
