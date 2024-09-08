import React, { useCallback, useEffect, useRef, useState } from "react";
import { Order, VendorLocation } from "delivfree";
import { useAppSelector } from "app/redux/store";
import { listenToActiveCustomerOrder } from "app/apis/orders";
import { Pressable, View, ViewStyle } from "react-native";
import { ViewOrderModal } from "./ViewOrder";
import { BottomSheetRef } from "../Modal/BottomSheet";
import { fetchVendorLocation } from "app/apis/vendorLocations";
import { Text } from "../Text";
import { $row, $shadow } from "../styles";
import { colors, spacing } from "app/theme";
import { Icon } from "../Icon";
import { borderRadius } from "app/theme/borderRadius";
import { sizing } from "app/theme/sizing";

export const CustomerOrderTracker = ({ style }: { style?: ViewStyle }) => {
  const viewOrder = useRef<BottomSheetRef>(null);

  const authToken = useAppSelector((state) => state.auth.authToken);

  const [vendorLocation, setVendorLocation] = useState<VendorLocation>();
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    if (authToken) {
      unsubscribe = listenToActiveCustomerOrder(authToken, async (_order) => {
        try {
          if (_order) {
            const _vendorLocation = await fetchVendorLocation(
              _order.vendorLocation
            );
            setVendorLocation(_vendorLocation);
            setOrder(_order);
          } else {
            setVendorLocation(undefined);
            setOrder(undefined);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
    return unsubscribe;
  }, [authToken]);

  const openViewOrder = useCallback(() => {
    viewOrder.current?.snapToIndex(0);
  }, []);
  const closeViewOrder = useCallback(() => {
    viewOrder.current?.close();
  }, []);

  if (!(order && vendorLocation)) {
    return null;
  }

  return (
    <>
      <Pressable style={[$container, $shadow, style]} onPress={openViewOrder}>
        <View style={$row}>
          <Icon
            icon="timer-outline"
            style={{ marginRight: spacing.xxs }}
            size={sizing.md}
            color={colors.primary}
          />
          <Text style={{ color: colors.primary }}>Order in progress</Text>
        </View>
        <Text preset="subheading">{vendorLocation.name}</Text>
        <Text size={"xs"} style={{ color: colors.textDim }}>
          Estimated delivery 25-35 minutes
        </Text>
      </Pressable>
      <ViewOrderModal ref={viewOrder} order={order} onClose={closeViewOrder} />
    </>
  );
};

const $container: ViewStyle = {
  backgroundColor: colors.background,
  borderRadius: borderRadius.md,
  padding: spacing.sm,
};
