import { spacing } from "app/theme";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import { getStatusColor, getStatusText } from "app/utils/orders";
import { View, ViewStyle } from "react-native";
import { Text } from "../Text";
import moment from "moment";
import React, { useMemo } from "react";
import { DataCell, TableCell } from "../TableCell";
import { Props } from "./OrderItem";

export const OrderItemWeb = React.memo(function OrderItemWeb({
  order,
  onOrderPress,
  driverName,
}: Props) {
  const dataCells: DataCell[] = useMemo(
    () => [
      {
        text: localizeCurrency(Number(order.total), order.currency),
      },
      {
        text: localizeCurrency(Number(order.tip), order.currency),
      },
      {
        text:
          order.checkoutItems.length +
          pluralFormat(" item", order.checkoutItems.length),
      },
      {
        text: moment(order.date).format("MMM Do, h:mma"),
      },
      {
        text: order.driver ? driverName : "Unassigned",
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
      },
    ],
    [order]
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
