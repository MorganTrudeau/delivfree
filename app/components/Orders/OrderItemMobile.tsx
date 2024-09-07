import { colors, spacing } from "app/theme";
import { Pressable, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { ButtonSmall } from "../ButtonSmall";
import { $flex, $row } from "../styles";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import moment from "moment";
import { Icon } from "../Icon";
import { Props } from "./OrderItem";
import React from "react";
import { getStatusColor, getStatusText } from "app/utils/orders";
import { IconButton } from "../IconButton";

export const OrderItemMobile = ({
  order,
  userType,
  onOrderPress,
  claimOrder,
  driverId,
  changeOrderStatus,
  driverName,
  onOrderCompleted,
}: Props) => {
  const showClaimButton = userType === "driver" && !order.driver;
  const showStatusButtons =
    order.driver === driverId &&
    (!["complete", "incomplete", "canceled"].includes(order.status) ||
      (order.status === "complete" && !order.dropOffPicture));

  return (
    <Pressable style={$listRow} onPress={() => onOrderPress(order)}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={$flex}
        preset="subheading"
        size="sm"
      >
        {order.checkoutItems.length}{" "}
        {pluralFormat("item", order.checkoutItems.length)}
      </Text>

      <View style={$row}>
        <Text style={{ marginRight: spacing.md }} size={"xs"}>
          Order total: {localizeCurrency(Number(order.total), order.currency)}
        </Text>

        <Text size={"xs"}>
          Tip: {localizeCurrency(Number(order.tip), order.currency)}
        </Text>
      </View>

      <View style={[$row, { marginTop: spacing.xxs }]}>
        <View style={[$row, $flex]}>
          <View
            style={[
              $statusBubble,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          />
          <Text size={"xs"}>{getStatusText(order.status)}</Text>
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          size={"xs"}
          style={{ color: colors.textDim }}
        >
          {moment(order.date).format("MMM Do, h:mma")}
        </Text>
      </View>

      {!driverId && !!driverName && (
        <Text style={{ marginTop: spacing.xs }} size={"xs"}>
          Driver: {driverName}
        </Text>
      )}

      {(showClaimButton || showStatusButtons) && (
        <View style={[$row, { marginTop: spacing.sm }]}>
          {showClaimButton && (
            <ButtonSmall
              text="Claim order"
              onPress={() => claimOrder(order.id)}
            />
          )}
          {showStatusButtons && (
            <View style={$row}>
              <View style={[$row, $flex]}>
                <ButtonSmall
                  text="Arrived"
                  style={{ marginRight: spacing.sm }}
                  onPress={() => changeOrderStatus(order.id, "arrived")}
                  RightAccessory={
                    order.status === "arrived"
                      ? ({ style }) => (
                          <Icon
                            icon={"check-circle"}
                            color={colors.primary}
                            style={style}
                          />
                        )
                      : undefined
                  }
                  disabled={order.status === "arrived"}
                />
                <ButtonSmall
                  text="Complete"
                  onPress={() => {
                    changeOrderStatus(order.id, "complete");
                    onOrderCompleted(order);
                  }}
                  style={{ marginRight: spacing.sm }}
                />
              </View>
              {order.status === "complete" && !order.dropOffPicture && (
                <IconButton
                  icon={"camera"}
                  onPress={() => {
                    onOrderCompleted(order);
                  }}
                />
              )}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

const STATUS_BUBBLE_SIZE = 15;
const $listRow: ViewStyle = {
  paddingVertical: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderLight,
};
const $statusBubble: ViewStyle = {
  height: STATUS_BUBBLE_SIZE,
  width: STATUS_BUBBLE_SIZE,
  borderRadius: STATUS_BUBBLE_SIZE / 2,
  marginRight: spacing.xs,
};
