import React, { useCallback, useEffect } from "react";
import { Order, OrderStatus } from "delivfree";
import { FlatList, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import moment from "moment";
import { localizeCurrency } from "app/utils/general";
import { colors, spacing } from "app/theme";
import { useAppSelector } from "app/redux/store";

interface Props {
  orders: Order[];
  style?: StyleProp<ViewStyle>;
  loadOrders: () => void;
  onOrderPress: (order: Order) => void;
}

const HEADERS = [
  "Amount",
  "Tip",
  "Description",
  "Customer",
  "Date",
  "Status",
] as const;

const getHeaderWidth = (header: (typeof HEADERS)[number]) => {
  return undefined;
  switch (header) {
    case "Amount":
      140;
    case "Tip":
      return 140;
    case "Customer":
      return undefined;
    case "Date":
      return 200;
    case "Description":
      return undefined;
    case "Status":
      return 150;
    default:
      return 200;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "incomplete":
      return colors.error;
    case "canceled":
      return colors.palette.shade500;
    case "complete":
      return colors.success;
    case "in-progress":
      return colors.palette.accent500;
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case "incomplete":
      return "Incomplete";
    case "canceled":
      return "Cancelled";
    case "complete":
      return "Complete";
    case "in-progress":
      return "In progress";
  }
};

export const OrdersList = ({
  orders,
  style,
  loadOrders,
  onOrderPress,
}: Props) => {
  useEffect(() => {
    loadOrders();
  }, []);

  const customers = useAppSelector((state) => state.customers.data);

  const renderHeader = () => {
    return (
      <View style={$header}>
        {HEADERS.map((header) => (
          <View
            key={header}
            style={[$tableCell, { maxWidth: getHeaderWidth(header) }]}
          >
            <Text preset="subheading" size="xs">
              {header}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderItem = useCallback(({ item: order }: { item: Order }) => {
    return (
      <Pressable
        key={order.id}
        style={$listRow}
        onPress={() => onOrderPress(order)}
      >
        <View style={[$tableCell, { maxWidth: getHeaderWidth("Amount") }]}>
          <Text preset="subheading" size="sm">
            {localizeCurrency(Number(order.amount), "USD")}
          </Text>
        </View>
        <View style={[$tableCell, { maxWidth: getHeaderWidth("Tip") }]}>
          <Text>{localizeCurrency(Number(order.tip), "USD")}</Text>
        </View>
        <View style={[$tableCell, { maxWidth: getHeaderWidth("Description") }]}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {order.description}
          </Text>
        </View>
        <View style={[$tableCell, { maxWidth: getHeaderWidth("Customer") }]}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {customers[order.customer].name}
          </Text>
        </View>
        <View style={[$tableCell, { maxWidth: getHeaderWidth("Date") }]}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {moment(order.date).format("MMM Do, h:mma")}
          </Text>
        </View>
        <View
          style={[
            $tableCell,
            {
              maxWidth: getHeaderWidth("Status"),
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              $statusBubble,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          />
          <Text>{getStatusText(order.status)}</Text>
        </View>
      </Pressable>
    );
  }, []);

  const renderEmptyComponent = useCallback(
    () => (
      <Text preset="bold" style={{ margin: spacing.md, alignSelf: "center" }}>
        No orders for this location
      </Text>
    ),
    []
  );

  return (
    <View style={style}>
      {renderHeader()}
      <FlatList
        data={orders}
        renderItem={renderItem}
        onEndReached={loadOrders}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const $header: ViewStyle = {
  paddingVertical: spacing.xs,
  flexDirection: "row",
  alignItems: "center",
  borderTopWidth: 1,
  borderTopColor: colors.border,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderLight,
};

const $listRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.xs,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderLight,
};

const $tableCell: ViewStyle = {
  flex: 1,
  paddingEnd: spacing.md,
};

const STATUS_BUBBLE_SIZE = 15;
const $statusBubble: ViewStyle = {
  height: STATUS_BUBBLE_SIZE,
  width: STATUS_BUBBLE_SIZE,
  borderRadius: STATUS_BUBBLE_SIZE / 2,
  marginRight: spacing.xs,
};
