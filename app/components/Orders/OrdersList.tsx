import React from "react";
import { Order, OrderStatus } from "functions/src/types";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import moment from "moment";
import { localizeCurrency } from "app/utils/general";
import { colors, spacing } from "app/theme";

interface Props {
  orders: Order[];
  style?: StyleProp<ViewStyle>;
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
  switch (header) {
    case "Amount":
      140;
    case "Tip":
      return 140;
    case "Customer":
      return 150;
    case "Date":
      return 200;
    case "Description":
      return 220;
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

export const OrdersList = ({ orders, style }: Props) => {
  const renderHeader = () => {
    return (
      <View style={$header}>
        {HEADERS.map((header) => (
          <View
            key={header}
            style={{ flex: 1, maxWidth: getHeaderWidth(header) }}
          >
            <Text preset="subheading" size="xs">
              {header}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={style}>
      {renderHeader()}
      {orders.map((order) => {
        return (
          <Pressable key={order.id} style={$listRow}>
            <View style={{ flex: 1, maxWidth: getHeaderWidth("Amount") }}>
              <Text preset="subheading" size="sm">
                {localizeCurrency(order.amount, "USD")}
              </Text>
            </View>
            <View style={{ flex: 1, maxWidth: getHeaderWidth("Tip") }}>
              <Text>{localizeCurrency(order.tip, "USD")}</Text>
            </View>
            <View style={{ flex: 1, maxWidth: getHeaderWidth("Description") }}>
              <Text>{order.description}</Text>
            </View>
            <View style={{ flex: 1, maxWidth: getHeaderWidth("Customer") }}>
              <Text>{order.customer}</Text>
            </View>
            <View style={{ flex: 1, maxWidth: getHeaderWidth("Date") }}>
              <Text>{moment(order.date).format("MMM Do, h:mma")}</Text>
            </View>
            <View
              style={{
                flex: 1,
                maxWidth: getHeaderWidth("Status"),
                flexDirection: "row",
                alignItems: "center",
              }}
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
      })}
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

const STATUS_BUBBLE_SIZE = 15;
const $statusBubble: ViewStyle = {
  height: STATUS_BUBBLE_SIZE,
  width: STATUS_BUBBLE_SIZE,
  borderRadius: STATUS_BUBBLE_SIZE / 2,
  marginRight: spacing.xs,
};
