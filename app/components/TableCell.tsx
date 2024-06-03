import { colors, spacing } from "app/theme";
import { Pressable, View, ViewStyle } from "react-native";
import { Text } from "./Text";
import React from "react";

export type DataCell =
  | { text: string; maxWidth?: number }
  | { renderData: () => React.ReactNode; maxWidth?: number };
interface Props<T> {
  data: T;
  dataCells: DataCell[];
  onPress?: (data: T) => void;
}

export const TableCell = <T,>({ data, dataCells, onPress }: Props<T>) => {
  return (
    <Pressable
      style={$listRow}
      onPress={onPress ? () => onPress(data) : undefined}
    >
      {dataCells.map((dataCell, index) => {
        return (
          <View
            key={`${
              "renderData" in dataCell ? "data" : dataCell.text
            }-${index}`}
            style={[$tableCell, { maxWidth: dataCell.maxWidth }]}
          >
            {"renderData" in dataCell ? (
              dataCell.renderData()
            ) : (
              <Text
                size="sm"
                numberOfLines={1}
                ellipsizeMode="tail"
                preset={index === 0 ? "semibold" : "default"}
              >
                {dataCell.text}
              </Text>
            )}
          </View>
        );
      })}
    </Pressable>
  );
};

const $listRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.xs,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderLight,
};

const $tableCell: ViewStyle = {
  flex: 1,
  paddingEnd: spacing.md,
  flexDirection: "row",
  alignItems: "center",
};

const STATUS_BUBBLE_SIZE = 15;
const $statusBubble: ViewStyle = {
  height: STATUS_BUBBLE_SIZE,
  width: STATUS_BUBBLE_SIZE,
  borderRadius: STATUS_BUBBLE_SIZE / 2,
  marginRight: spacing.xs,
};
