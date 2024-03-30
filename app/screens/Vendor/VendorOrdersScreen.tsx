import { Button, Icon, Screen, Text } from "app/components";
import { ButtonSmall } from "app/components/ButtonSmall";
import { Drawer } from "app/components/Drawer";
import { OrdersList } from "app/components/Orders/OrdersList";
import {
  $containerPadding,
  $flexRow,
  $row,
  $screen,
} from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import { Order } from "functions/src/types";
import React, { useMemo } from "react";
import { View, ViewStyle } from "react-native";

interface VendorOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

const ORDERS: Order[] = [
  {
    id: "a",
    customer: "James",
    amount: 240.99,
    tip: 240.99 * 0.25,
    status: "in-progress",
    description: "Family Combo",
    date: "2024-03-28T17:14:35-07:00",
  },
  {
    id: "b",
    customer: "Sarah",
    amount: 122.99,
    tip: 122.99 * 0.2,
    status: "complete",
    description: "2 pepperoni pizzas",
    date: "2024-03-28T17:14:35-07:00",
  },
  {
    id: "c",
    customer: "Liam",
    amount: 590.99,
    tip: 590.99 * 0.25,
    status: "complete",
    description: "10 supreme pizzas",
    date: "2024-03-28T17:14:35-07:00",
  },
  {
    id: "d",
    customer: "John",
    amount: 225.99,
    tip: 225.99 * 0.3,
    status: "complete",
    description: "Steak & Lobster Dinner",
    date: "2024-03-28T17:14:35-07:00",
  },
];

console.log(ORDERS);

export const VendorOrdersScreen = (props: VendorOrdersScreenProps) => {
  const PlusIcon = useMemo(
    () =>
      ({ style }) =>
        <Icon icon="plus" color={"#fff"} style={style} />,
    []
  );
  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <View style={[$row, { justifyContent: "space-between" }]}>
          <Text preset="heading">Orders</Text>
          <ButtonSmall
            LeftAccessory={PlusIcon}
            text={"Create Order"}
            preset="filled"
          />
        </View>
        <OrdersList orders={ORDERS} style={$list} />
      </Screen>
    </Drawer>
  );
};

const $list: ViewStyle = {
  marginTop: spacing.md,
};
