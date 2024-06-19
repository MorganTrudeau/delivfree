import { spacing } from "app/theme";
import { localizeCurrency } from "app/utils/general";
import React from "react";
import { View, ViewStyle } from "react-native";
import { $borderTopLight, $flexRowBetween } from "../styles";
import { Text } from "../Text";
import { TipType } from "functions/src/types";
import { TipSelect } from "./TipSelect";

export const CheckoutTotals = ({
  style,
  tax,
  subtotal,
  tip,
  total,
  currency = "CAD",
  onTipChange,
  tipAmount = "",
  tipType = "18",
}: {
  style?: ViewStyle;
  tax: string | number;
  subtotal: string | number;
  tip: string | number;
  total: string | number;
  currency: string | undefined;
  onTipChange?: (type: TipType, amount?: string) => void;
  tipAmount?: string;
  tipType?: TipType;
}) => {
  return (
    <View style={style}>
      <View style={$totalItem}>
        <Text>Subtotal</Text>
        <Text>{localizeCurrency(Number(subtotal), currency)}</Text>
      </View>
      <View style={$totalItem}>
        <Text>Fees</Text>
        <Text>{localizeCurrency(0, currency)}</Text>
      </View>
      <View style={$totalItem}>
        <Text>Tax</Text>
        <Text>{localizeCurrency(Number(tax), currency)}</Text>
      </View>
      <View style={[$borderTopLight, { marginVertical: spacing.xxs }]} />
      <View style={{ marginVertical: spacing.xxs }}>
        <View
          style={[
            {
              marginBottom: onTipChange ? spacing.xs : 0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text>{onTipChange ? "Tip your driver" : "Tip"}</Text>
          <Text>{localizeCurrency(Number(tip), currency)}</Text>
        </View>
        {onTipChange && (
          <TipSelect
            selectedTipType={tipType}
            onChangeType={onTipChange}
            amount={tipAmount}
          />
        )}
      </View>
      <View style={[$borderTopLight, { marginVertical: spacing.xxs }]} />
      <View style={$totalItem}>
        <Text preset="semibold">Total</Text>
        <Text preset="semibold">
          {localizeCurrency(Number(total), currency)}
        </Text>
      </View>
    </View>
  );
};

const $totalItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginVertical: spacing.xxs,
};
