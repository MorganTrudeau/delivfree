import React from "react";
import { Screen } from "app/components";
import { $containerPadding } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { Drawer } from "app/components/Drawer";
import { ManageDriverSubscription } from "app/components/Subscription/ManageDriverSubscription";

interface VendorSubscriptionScreenProps
  extends AppStackScreenProps<"Subscription"> {}

export const DriverSubscriptionScreen = ({
  navigation,
}: VendorSubscriptionScreenProps) => {
  return (
    <Drawer navigation={navigation}>
      <Screen
        preset="scroll"
        style={{ flex: 1, maxWidth: undefined }}
        contentContainerStyle={$containerPadding}
        inDrawer
      >
        <ManageDriverSubscription displayOnly={true} />
      </Screen>
    </Drawer>
  );
};
