import React from "react";
import { View, ViewStyle } from "react-native";
import Stripe from "stripe";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import { FULL_TIME_ORDERS, PART_TIME_ORDERS } from "app/utils/subscriptions";
import { Positions } from "delivfree";
import { QuantitySelector } from "../QuantitySelector";

interface Props {
  positions: Positions;
  onChangeFullTimePositions: (positions: number) => void;
  onChangePartTimePositions: (positions: number) => void;
  style?: ViewStyle;
}

export const PositionsSelect = ({
  positions,
  onChangeFullTimePositions,
  onChangePartTimePositions,
  style,
}: Props) => {
  const { maxFullTime, maxPartTime, filledFullTime, filledPartTime } =
    positions;

  // const renderFullTimePrice = () => (
  //   <Text size={"xs"}>
  //     (Qty {maxFullTime}){" "}
  //     {localizeCurrency(
  //       (((fullTimeProduct.default_price as Stripe.Price)
  //         .unit_amount as number) *
  //         maxFullTime) /
  //         100,
  //       "USD"
  //     )}
  //     /Month
  //   </Text>
  // );

  // const renderSurgePrice = () => (
  //   <Text size={"xs"}>
  //     (Qty {maxPartTime}){" "}
  //     {localizeCurrency(
  //       (((partTimeProduct.default_price as Stripe.Price)
  //         .unit_amount as number) *
  //         maxPartTime) /
  //         100,
  //       "USD"
  //     )}
  //     /Month
  //   </Text>
  // );

  return (
    <View style={style}>
      <View style={$item}>
        <Text preset="semibold">
          {maxFullTime} Full time {pluralFormat("driver", maxFullTime)} per{" "}
          {maxFullTime * FULL_TIME_ORDERS} deliveries a day.
        </Text>
        {/* {renderFullTimePrice()} */}
        <QuantitySelector
          disableDecrease={maxFullTime <= filledFullTime}
          changeQuantity={(n) => onChangeFullTimePositions(maxFullTime + n)}
          style={{ marginTop: spacing.xs }}
        />
      </View>

      <View style={[$item, { marginTop: spacing.sm }]}>
        <Text preset="semibold">
          {maxPartTime} Part time {pluralFormat("driver", maxPartTime)} for{" "}
          {maxPartTime * PART_TIME_ORDERS} deliveries per half day. Covers 3
          half days a week of your choice.
        </Text>
        {/* {renderSurgePrice()} */}
        <QuantitySelector
          disableDecrease={maxPartTime <= filledPartTime}
          changeQuantity={(n) => onChangePartTimePositions(maxPartTime + n)}
          style={{ marginTop: spacing.xs }}
        />
      </View>
    </View>
  );
};

const $item: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.md,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.sm,
  width: "100%",
};
