import React, { useMemo } from "react";
import { Linking, Pressable, View, ViewStyle } from "react-native";
import Stripe from "stripe";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { $flex, $row } from "../styles";
import { capitalize, localizeCurrency } from "app/utils/general";
import {
  getPositionsFromSubscription,
  getSubscriptionPrice,
} from "app/utils/subscriptions";
import moment from "moment";

type Props = {
  subscription: Stripe.Subscription;
  style?: ViewStyle;
  onPress?: () => void;
};

export const SubscriptionInfo = ({ subscription, style, onPress }: Props) => {
  const { fullTime, partTime } = useMemo(
    () => getPositionsFromSubscription(subscription),
    []
  );

  const price = useMemo(
    () => getSubscriptionPrice(subscription),
    [subscription]
  );

  const trialEnd = useMemo(
    () =>
      subscription.trial_end
        ? moment(subscription.trial_end * 1000).format("MMM Do")
        : "",
    [subscription.trial_end]
  );

  return (
    <Pressable
      style={[$row, { paddingVertical: spacing.xxs }, style]}
      disabled={!onPress}
      onPress={onPress}
    >
      <View
        style={[
          $statusLabel,
          {
            borderColor: getStatusBorderColor(subscription.status),
            borderWidth: 2,
            backgroundColor: getStatusBackgroundColor(subscription.status),
            marginRight: spacing.sm,
          },
        ]}
      >
        <Text size="xs">
          {trialEnd
            ? "Trial ends " + trialEnd
            : capitalize(subscription.status)}
        </Text>
      </View>
      <View style={$flex}>
        <Text>
          {!!fullTime && (
            <Text preset="semibold">Full time positions x {fullTime}</Text>
          )}
          {!!fullTime && !!partTime && <Text preset="semibold"> & </Text>}
          {!!partTime && (
            <Text preset="semibold">Part time positions x {partTime}</Text>
          )}
        </Text>
        <Text>{localizeCurrency(price, "CAD")}/Month</Text>
      </View>
    </Pressable>
  );
};

const $statusLabel: ViewStyle = {
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 5,
};

const getStatusBorderColor = (status: Stripe.Subscription["status"]) => {
  switch (status) {
    case "active":
      return colors.palette.success500;
    case "trialing":
      return "#a7e7fc";
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
      return colors.palette.shade500;
    case "unpaid":
    case "past_due":
      return colors.palette.primary600;
    case "paused":
      return colors.palette.accent500;
  }
};

const getStatusBackgroundColor = (status: Stripe.Subscription["status"]) => {
  switch (status) {
    case "active":
      return colors.palette.success100;
    case "trialing":
      return "#d0f6fd";
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
      return colors.palette.secondary100;
    case "unpaid":
    case "past_due":
      return colors.palette.primary100;
    case "paused":
      return colors.palette.accent100;
  }
};
