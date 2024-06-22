import React from "react";
import { Screen } from "app/components";
import { $containerPadding } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { ManageVendorSubscription } from "app/components/Subscription/ManageVendorSubscription";
import { spacing } from "app/theme";
import { LogoutButton } from "app/components/LogoutButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface VendorStartSubscriptionScreenProps
  extends AppStackScreenProps<"StartSubscription"> {}

export const VendorStartSubscriptionScreen = (
  props: VendorStartSubscriptionScreenProps
) => {
  const insets = useSafeAreaInsets();
  return (
    <Screen
      preset="scroll"
      style={{ flex: 1, maxWidth: undefined }}
      contentContainerStyle={[
        $containerPadding,
        { paddingBottom: spacing.md + insets.bottom },
      ]}
    >
      <ManageVendorSubscription />
      <LogoutButton style={{ alignSelf: "center", marginTop: spacing.md }} />
    </Screen>
  );
};
