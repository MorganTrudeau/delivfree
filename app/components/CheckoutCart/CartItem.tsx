import { CheckoutItem } from "app/redux/reducers/checkoutCart";
import { colors, spacing } from "app/theme";
import React, { useMemo } from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { localizeCurrency } from "app/utils/general";
import { $borderBottomLight, $row } from "../styles";
import { QuantitySelectorInline } from "../QuantitySelectorInline";

export const CartItem = ({
  item,
  onChangeQuantity,
  style,
}: {
  item: CheckoutItem;
  onChangeQuantity?: (item: string, quantity: number) => void;
  style?: ViewStyle;
}) => {
  const itemPrice = useMemo(() => {
    return (
      Number(item.item.price) * item.quantity +
      item.customizations.reduce((acc, choice) => {
        return acc + (Number(choice.choice.price) || 0) * choice.quantity;
      }, 0)
    );
  }, [item]);

  return (
    <View style={[{ paddingVertical: spacing.sm }, $borderBottomLight, style]}>
      <Text preset="semibold">
        {item.item.name} <Text size={"xs"}>( {item.quantity} )</Text>
      </Text>

      {item.customizations.map((customization, customizationIndex) => {
        return (
          <View
            key={`checkout-customization-${customization.choice.id}-${customizationIndex}`}
          >
            <Text style={{ color: colors.textDim }} size="xs">
              {customization.choice.name}

              {customization.choice.price && Number(customization.choice.price)
                ? ` +${localizeCurrency(
                    Number(customization.choice.price),
                    "CAD"
                  )}`
                : ""}
            </Text>
          </View>
        );
      })}

      <View
        style={[
          $row,
          { justifyContent: "space-between", marginTop: spacing.xxs },
        ]}
      >
        <Text>{localizeCurrency(itemPrice, "CAD")}</Text>
        {onChangeQuantity && (
          <QuantitySelectorInline
            quantity={item.quantity}
            decreaseIcons={{ 1: "trash-can" }}
            changeQuantity={(q) => onChangeQuantity(item.id, item.quantity + q)}
          />
        )}
      </View>
    </View>
  );
};
