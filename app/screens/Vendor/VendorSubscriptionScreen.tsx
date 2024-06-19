import React from "react";
import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { ManageVendorSubscription } from "app/components/Subscription/ManageVendorSubscription";

interface VendorSubscriptionScreenProps
  extends AppStackScreenProps<"Subscription"> {}

export const VendorSubscriptionScreen = ({
  navigation,
}: VendorSubscriptionScreenProps) => {
  return (
    <Screen
      preset="scroll"
      style={$screen}
      contentContainerStyle={$containerPadding}
      
    >
      <ManageVendorSubscription displayOnly={true} />
    </Screen>
  );
};
