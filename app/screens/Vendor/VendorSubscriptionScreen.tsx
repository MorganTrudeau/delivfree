import { Screen, Text } from "app/components";
import { Drawer } from "app/components/Drawer";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import React from "react";
import { spacing } from "app/theme";
import { Card } from "app/components/Card";
import { AppLogo } from "app/components/AppLogo";
import { SubscriptionProducts } from "app/components/Subscription/SubscriptionProducts";
import { LogoutButton } from "app/components/LogoutButton";
import { useAppSelector } from "app/redux/store";

interface VendorSubscriptionScreenProps
  extends AppStackScreenProps<"Subscription" | "StartSubscription"> {}

export const VendorSubscriptionScreen = ({
  route,
  navigation,
}: VendorSubscriptionScreenProps) => {
  const userType = useAppSelector((state) => state.appConfig.userType);

  const subscription = useAppSelector((state) => state.subscription.data);

  if (route.params?.locked) {
    return (
      <Screen
        preset="scroll"
        style={{ flex: 1, maxWidth: undefined }}
        contentContainerStyle={$containerPadding}
      >
        <Card>
          <AppLogo style={{ marginBottom: spacing.lg }} height={50} />
          <Text preset="heading" style={{ marginBottom: spacing.md }}>
            Set your orders
          </Text>
          <SubscriptionProducts
            editable={userType !== "driver"}
            subscription={subscription}
          />
        </Card>
        <LogoutButton style={{ alignSelf: "center", marginTop: spacing.md }} />
      </Screen>
    );
  }

  return (
    <Drawer navigation={navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <Text preset="heading">Subscription</Text>
        <Card style={{ marginTop: spacing.md, alignSelf: "flex-start" }}>
          <SubscriptionProducts
            editable={userType !== "driver"}
            subscription={subscription}
          />
        </Card>
      </Screen>
    </Drawer>
  );
};
