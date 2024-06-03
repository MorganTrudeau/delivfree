import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Text } from "../Text";
import { Props } from "./DriverItem";
import { $borderBottom, $flex } from "../styles";
import { spacing } from "app/theme";
import React from "react";
import { StatusIndicator } from "../StatusIndicator";

export const DriverItemMobile = ({ driver, onPress, showStatus }: Props) => {
  return (
    <Pressable style={$item} onPress={() => onPress && onPress(driver)}>
      <Text style={$flex} preset="subheading">
        {driver.firstName} {driver.lastName}
      </Text>
      <Text>
        {driver.callingCode} {driver.phoneNumber}
      </Text>
      {showStatus && (
        <StatusIndicator
          status={driver.registration.status}
          style={{ marginTop: spacing.xxs }}
        />
      )}
    </Pressable>
  );
};

const $item: StyleProp<ViewStyle> = [
  $borderBottom,
  { paddingVertical: spacing.md },
];
