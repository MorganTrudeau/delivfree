import { spacing } from "app/theme";
import { localizeCurrency } from "app/utils/general";
import {
  getHeaderWidth,
  getStatusColor,
  getStatusText,
} from "app/utils/orders";
import { Order } from "functions/src/types";
import { View, ViewStyle } from "react-native";
import { Text } from "../Text";
import moment from "moment";
import React, { useMemo } from "react";
import { DataCell, TableCell } from "../TableCell";
import { Props } from "./OrderItem";

export const OrderItemWeb = React.memo(function OrderItemWeb({
  order,
  onOrderPress,
  customer,
  driverName,
}: Props) {
  const dataCells: DataCell[] = useMemo(
    () => [
      {
        text: localizeCurrency(Number(order.amount), "USD"),
        maxWidth: getHeaderWidth("Amount"),
      },
      {
        text: localizeCurrency(Number(order.tip), "USD"),
        maxWidth: getHeaderWidth("Tip"),
      },
      { text: order.description, maxWidth: getHeaderWidth("Description") },
      { text: customer.name, maxWidth: getHeaderWidth("Customer") },
      {
        text: moment(order.date).format("MMM Do, h:mma"),
        maxWidth: getHeaderWidth("Date"),
      },
      {
        text: order.driver ? driverName : "Unassigned",
        maxWidth: getHeaderWidth("Driver"),
      },
      {
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
        maxWidth: getHeaderWidth("Status"),
      },
    ],
    [order, customer.name]
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
