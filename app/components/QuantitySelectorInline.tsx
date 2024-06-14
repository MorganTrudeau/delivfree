import React from "react";
import {
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { $borderedArea, $row } from "./styles";
import { Icon, IconTypes } from "./Icon";
import { Text } from "./Text";
import { spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";

export const QuantitySelectorInline = ({
  quantity,
  changeQuantity,
  disableDecrease,
  disableIncrease,
  style,
  decreaseIcons,
  increaseIcons,
}: {
  quantity: number;
  changeQuantity: (change: number) => void;
  disableDecrease?: boolean;
  disableIncrease?: boolean;
  style?: ViewStyle;
  simplified?: boolean;
  decreaseIcons?: { [q: number]: IconTypes };
  increaseIcons?: { [q: number]: IconTypes };
}) => {
  const decreaseIcon = decreaseIcons?.[quantity] || "minus";
  const increaseIcon = increaseIcons?.[quantity] || "plus";
  return (
    <View style={[$row, $borderedArea, $container, style]}>
      <Pressable
        disabled={disableDecrease}
        style={[
          $quantityButton,
          { marginRight: spacing.xs, opacity: disableDecrease ? 0.5 : 1 },
        ]}
        onPress={() => changeQuantity(-1)}
      >
        <Icon icon={decreaseIcon} />
      </Pressable>
      <Text preset="semibold">{quantity}</Text>
      <Pressable
        disabled={disableIncrease}
        style={[
          $quantityButton,
          { marginLeft: spacing.xs, opacity: disableIncrease ? 0.5 : 1 },
        ]}
        onPress={() => changeQuantity(1)}
      >
        <Icon icon={increaseIcon} />
      </Pressable>
    </View>
  );
};

const $container: ViewStyle = {
  borderRadius: borderRadius.lg,
  paddingVertical: 0,
  paddingHorizontal: 0,
};
const $quantityButton: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.xxs,
  paddingVertical: spacing.xxs,
};
