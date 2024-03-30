import { Screen, Text } from "app/components";
import { Drawer } from "app/components/Drawer";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import React from "react";

interface VendorSubscriptionScreenProps
  extends AppStackScreenProps<"Subscription"> {}

export const VendorSubscriptionScreen = (
  props: VendorSubscriptionScreenProps
) => {
  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <Text preset="heading">Subscription</Text>
      </Screen>
    </Drawer>
  );
};
