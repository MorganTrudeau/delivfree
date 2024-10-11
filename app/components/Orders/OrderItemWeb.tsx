import { spacing } from "app/theme";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import { getStatusColor, getStatusText } from "app/utils/orders";
import { View, ViewStyle } from "react-native";
import { Text } from "../Text";
import moment from "moment";
import React, { useMemo } from "react";
import { DataCell, TableCell } from "../TableCell";
import { Props } from "./OrderItem";
import { VendorLocationName } from "../VendorLocations/VendorLocationName";
import { $flex, $flexShrink } from "../styles";

export const OrderItemWeb = React.memo(function OrderItemWeb({
  order,
  onOrderPress,
  driverName,
  headers,
}: Props) {
  const dataCells: DataCell[] = useMemo(
    () =>
      headers.map((h) => {
        switch (h.value) {
          case "amount":
            return {
              text: localizeCurrency(Number(order.total), order.currency),
            };
          case "tip":
            return {
              text: localizeCurrency(Number(order.tip), order.currency),
            };
          case "items":
            return {
              text:
                order.checkoutItems.length +
                pluralFormat(" item", order.checkoutItems.length),
            };
          case "date":
            return {
              text: moment(order.date).format("MMM Do, h:mma"),
            };
          case "vendorLocation":
            return {
              renderData: () => (
                <View style={$flex}>
                  <VendorLocationName
                    id={order.vendorLocation}
                    style={$flexShrink}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  />
                </View>
              ),
            };
          case "driver":
            return {
              text: order.driver ? driverName : "Unassigned",
            };
          case "status":
            return {
              renderData: () => (
                <>
                  <View
                    style={[
                      $statusBubble,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  />
                  <Text
                    preset="subheading"
                    size="sm"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {getStatusText(order.status)}
                  </Text>
                </>
              ),
            };
          default:
            return { text: "" };
        }
      }),
    [order, headers]
  );

  return (
    <TableCell data={order} dataCells={dataCells} onPress={onOrderPress} />
  );
});

const STATUS_BUBBLE_SIZE = 15;
const $statusBubble: ViewStyle = {
  height: STATUS_BUBBLE_SIZE,
  width: STATUS_BUBBLE_SIZE,
  borderRadius: STATUS_BUBBLE_SIZE / 2,
  marginRight: spacing.xs,
};
