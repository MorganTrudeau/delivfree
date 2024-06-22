import React from "react";
import { Screen } from "app/components";
import { CheckoutForm } from "app/components/CheckoutCart/CheckoutForm";
import {
  $containerPadding,
  $screen,
  MAX_CONTAINER_WIDTH,
} from "app/components/styles";
import { useDimensions } from "app/hooks/useDimensions";
import { AppStackScreenProps } from "app/navigators";
import { colors, spacing } from "app/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RestaurantsScreenProps extends AppStackScreenProps<"Checkout"> {}

export const CheckoutScreen = function CheckoutScreen(
  props: RestaurantsScreenProps
) {
  const { width } = useDimensions();
  const insets = useSafeAreaInsets();

  const handlePaymentSuccess = () => {
    props.navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => null,
    });
  };

  return (
    <Screen
      style={$screen}
      backgroundColor={
        width > MAX_CONTAINER_WIDTH ? colors.surface : colors.background
      }
      contentContainerStyle={[
        $containerPadding,
        { paddingBottom: spacing.md + insets.bottom },
      ]}
      preset="scroll"
    >
      <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
    </Screen>
  );
};
