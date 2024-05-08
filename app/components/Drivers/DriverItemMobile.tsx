import { StyleProp, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { Props } from "./DriverItem";
import { $borderBottom, $flex, $row } from "../styles";
import { spacing } from "app/theme";
import React from "react";

export const DriverItemMobile = ({ driver }: Props) => {
  return (
    <View style={$item}>
      <Text style={$flex}>
        {driver.firstName} {driver.lastName}
      </Text>
      <Text>{driver.phoneNumber}</Text>
    </View>
  );
};

const $item: StyleProp<ViewStyle> = [
  $row,
  $borderBottom,
  { paddingVertical: spacing.sm },
];
