import { colors, spacing } from "app/theme";
import React, { useMemo } from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { localizeCurrency } from "app/utils/general";
import { $borderBottomLight, $row } from "../styles";
import { QuantitySelectorInline } from "../QuantitySelectorInline";
import { CheckoutItem } from "delivfree";

export const CartItem = ({
  item,
  onChangeQuantity,
  style,
  showPrice = true,
}: {
  item: CheckoutItem;
  onChangeQuantity?: (item: string, quantity: number) => void;
  style?: ViewStyle;
  showPrice?: boolean;
}) => {
  const itemPrice = useMemo(() => {
    return (
      Number(item.item.price) * item.quantity +
      item.customizations.reduce((acc, choice) => {
        if (choice.type === "note") {
          return acc;
        }
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
        if (customization.type === "note") {
          return (
            <Text
              style={{ color: colors.textDim }}
              size="xs"
              key={`checkout-customization-${customization.customization}-note`}
            >
              {customization.text}
            </Text>
          );
        } else {
          return (
            <View
              key={`checkout-customization-${customization.choice.id}-${customizationIndex}`}
            >
              <Text style={{ color: colors.textDim }} size="xs">
                {customization.allowsQuantity
                  ? `( ${customization.quantity} ) `
                  : ""}
                {customization.choice.name}

                {customization.choice.price &&
                showPrice &&
                Number(customization.choice.price)
                  ? ` +${localizeCurrency(
                      Number(customization.choice.price) *
                        customization.quantity,
                      "CAD"
                    )}`
                  : ""}
              </Text>
            </View>
          );
        }
      })}

      {(showPrice || onChangeQuantity) && (
        <View
          style={[
            $row,
            { justifyContent: "space-between", marginTop: spacing.xxs },
          ]}
        >
          {showPrice && <Text>{localizeCurrency(itemPrice, "CAD")}</Text>}
          {onChangeQuantity && (
            <QuantitySelectorInline
              quantity={item.quantity}
              decreaseIcons={{ 1: "trash-can" }}
              changeQuantity={(q) =>
                onChangeQuantity(item.id, item.quantity + q)
              }
            />
          )}
        </View>
      )}
    </View>
  );
};
