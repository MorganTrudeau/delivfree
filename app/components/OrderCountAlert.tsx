import React from "react";
import { listenToOrderCount } from "app/apis/orders";
import { useAppSelector } from "app/redux/store";
import { maxOrdersForSubscription } from "app/utils/subscriptions";
import { OrderCount } from "delivfree";
import { useEffect, useState } from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";

export const OrderCountAlert = ({ style }: { style?: ViewStyle }) => {
  const vendorId = useAppSelector((state) => state.vendor.activeVendor?.id);
  const vendorSubscription = useAppSelector(
    (state) => state.subscription.vendorSubscription
  );

  const [orderCount, setOrderCount] = useState<{ [date: string]: OrderCount }>(
    {}
  );
  const [overOrders, setOverOrders] = useState(false);

  useEffect(() => {
    const unsubscribe = vendorId
      ? listenToOrderCount(vendorId, (_orderCount) =>
          setOrderCount(_orderCount)
        )
      : () => {};
    return unsubscribe;
  }, [vendorId]);

  useEffect(() => {
    if (vendorSubscription) {
      const maxOrders = maxOrdersForSubscription(vendorSubscription);
      const overOrder = Object.values(orderCount).find(
        (c) => c.count > maxOrders
      );
      setOverOrders(!!overOrder);
    }
  }, [orderCount]);

  if (!overOrders) {
    return null;
  }

  return (
    <View style={[$container, style]}>
      <Text preset="semibold">Over limit reached</Text>
      <Text size={"xs"}>
        You have gone over your order limit this week. Consider upgrading your
        subscription.
      </Text>
    </View>
  );
};

const $container: ViewStyle = {
  padding: spacing.sm,
  borderRadius: borderRadius.md,
  borderWidth: 2,
  borderColor: colors.primary,
  alignSelf: "flex-start",
};
