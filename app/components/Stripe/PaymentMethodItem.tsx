import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { getCardSvg } from "app/utils/stripe";
import Stripe from "stripe";
import { colors, spacing } from "app/theme";
import { Text } from "../Text";
import DefaultVisa from "../../../assets/svg/cards/default.svg";

export const PaymentMethodItem = ({
  paymentMethod,
  style,
  titleStyle,
  subtitleStyle,
  iconStyle,
  iconColor,
  loading,
}: {
  paymentMethod?: Stripe.PaymentMethod;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  iconStyle?: ViewStyle;
  iconColor?: string;
  loading: boolean;
}) => {
  const card = paymentMethod?.card;
  const brand = card?.brand;

  const Icon = useMemo(() => getCardSvg(brand), [brand]);
  const svgSize = 80;
  return (
    <View style={[styles.cardContainer, style]}>
      <Icon
        width={svgSize}
        height={svgSize * 0.75}
        color={iconColor || colors.textDim}
        style={styles.icon}
      />

      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          style={styles.cardTextContainer}
        />
      ) : !!card ? (
        <View style={styles.cardTextContainer}>
          <Text preset={"semibold"} size={"md"} style={titleStyle}>
            •••• {card.last4}
          </Text>
          <Text size={"xs"} style={[{ color: colors.textDim }, subtitleStyle]}>
            Expires at{" "}
            {`${card.exp_month}/${card.exp_year.toString().substring(2)}`}
          </Text>
        </View>
      ) : (
        <View style={styles.cardTextContainer}>
          <Text style={titleStyle}>Enter card details</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTextContainer: {
    marginLeft: spacing.sm,
  },
  icon: { marginVertical: -5 },
});
