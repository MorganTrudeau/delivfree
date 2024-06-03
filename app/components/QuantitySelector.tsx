import React from "react";
import {
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { $row } from "./styles";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";

export const QuantitySelector = ({
  changeQuantity,
  disableDecrease,
  disableIncrease,
  style,
}: {
  changeQuantity: (change: number) => void;
  disableDecrease?: boolean;
  disableIncrease?: boolean;
  style?: ViewStyle;
}) => {
  return (
    <View style={[$row, style]}>
      <Pressable
        disabled={disableDecrease}
        style={[
          $quantityButton,
          { marginRight: spacing.xs, opacity: disableDecrease ? 0.5 : 1 },
        ]}
        onPress={() => changeQuantity(-1)}
      >
        <Icon icon="minus" />
        <Text selectable={false} style={$quantityButtonText}>
          Decrease
        </Text>
      </Pressable>
      <Pressable
        disabled={disableIncrease}
        style={[$quantityButton, { opacity: disableIncrease ? 0.5 : 1 }]}
        onPress={() => changeQuantity(1)}
      >
        <Text selectable={false} style={$quantityButtonText}>
          Increase
        </Text>
        <Icon icon="plus" />
      </Pressable>
    </View>
  );
};

const $quantityButtonText: TextStyle = { marginHorizontal: spacing.xxs };
const $quantityButton: ViewStyle = {
  borderRadius: borderRadius.md,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.surface,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
};
