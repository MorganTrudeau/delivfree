import { Screen } from "app/components";
import { CheckoutCart } from "app/components/CheckoutCart/CheckoutCart";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = AppStackScreenProps<"CheckoutCart">;

export const CheckoutCartScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };
  return (
    <Screen
      style={$screen}
      contentContainerStyle={[
        $containerPadding,
        { paddingBottom: insets.bottom + spacing.md },
      ]}
      preset="scroll"
    >
      <CheckoutCart onCheckout={handleCheckout} />
    </Screen>
  );
};
