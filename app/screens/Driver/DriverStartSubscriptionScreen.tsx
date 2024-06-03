import { Screen } from "app/components";
import { $containerPadding } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import React from "react";
import { spacing } from "app/theme";
import { LogoutButton } from "app/components/LogoutButton";
import { ManageDriverSubscription } from "app/components/Subscription/ManageDriverSubscription";

interface DriverStartSubscriptionScreenProps
  extends AppStackScreenProps<"StartSubscription"> {}

export const DriverStartSubscriptionScreen = (
  props: DriverStartSubscriptionScreenProps
) => {
  return (
    <Screen
      preset="scroll"
      style={{ flex: 1, maxWidth: undefined }}
      contentContainerStyle={$containerPadding}
    >
      <ManageDriverSubscription />
      <LogoutButton style={{ alignSelf: "center", marginTop: spacing.md }} />
    </Screen>
  );
};
