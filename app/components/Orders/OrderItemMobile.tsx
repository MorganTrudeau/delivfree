import { colors, spacing } from "app/theme";
import { OrderStatus } from "functions/src/types";
import { Pressable, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { ButtonSmall } from "../ButtonSmall";
import { $borderedArea, $flex, $row } from "../styles";
import { localizeCurrency } from "app/utils/general";
import moment from "moment";
import { Icon } from "../Icon";
import { Props } from "./OrderItem";

export const OrderItemMobile = ({
  order,
  userType,
  onOrderPress,
  customer,
  claimOrder,
  driverId,
  changeOrderStatus,
  driverName,
  onViewCustomer,
}: Props) => {
  const showClaimButton = userType === "driver" && !order.driver;
  const showStatusButtons =
    order.driver === driverId &&
    !["complete", "incomplete", "canceled"].includes(order.status);

  return (
    <Pressable style={$listRow} onPress={() => onOrderPress(order)}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={$flex}
        preset="subheading"
        size="sm"
      >
        {order.description}
      </Text>

      <View style={$row}>
        <Text style={{ marginRight: spacing.md }} size={"xs"}>
          Order value: {localizeCurrency(Number(order.amount), "USD")}
        </Text>

        <Text size={"xs"}>
          Tip: {localizeCurrency(Number(order.tip), "USD")}
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

      <View style={[$row, $borderedArea, { marginTop: spacing.sm }]}>
        <View style={$flex}>
          <Text size={"xxs"} style={{ color: colors.textDim }}>
            Customer
          </Text>
          <Text style={$flex}>{customer.name}</Text>
        </View>
        <ButtonSmall
          text={"View Customer"}
          onPress={() => onViewCustomer(customer)}
        />
      </View>

      {driverId && order.driver && order.driver !== driverId && (
        <Text style={{ marginTop: spacing.xs }}>Driver: {driverName}</Text>
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
            <>
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
                onPress={() => changeOrderStatus(order.id, "complete")}
              />
            </>
          )}
        </View>
      )}
    </Pressable>
  );
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "incomplete":
      return colors.error;
    case "canceled":
      return colors.palette.shade500;
    case "complete":
      return colors.success;
    case "arrived":
      return colors.palette.accent500;
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
    case "arrived":
      return "Arrived";
    case "in-progress":
      return "In progress";
  }
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
