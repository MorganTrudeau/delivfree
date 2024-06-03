import React from "react";
import { Screen } from "app/components";
import { $containerPadding } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { ManageVendorSubscription } from "app/components/Subscription/ManageVendorSubscription";
import { spacing } from "app/theme";
import { LogoutButton } from "app/components/LogoutButton";

interface VendorStartSubscriptionScreenProps
  extends AppStackScreenProps<"StartSubscription"> {}

export const VendorStartSubscriptionScreen = (
  props: VendorStartSubscriptionScreenProps
) => {
  return (
    <Screen
      preset="fixed"
      style={{ flex: 1, maxWidth: undefined }}
      contentContainerStyle={$containerPadding}
    >
      <ManageVendorSubscription />
      <LogoutButton style={{ alignSelf: "center", marginTop: spacing.md }} />
    </Screen>
  );
};
