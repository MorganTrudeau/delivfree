import { Screen } from "app/components";
import { ConsumerRegistrationModal } from "app/components/Auth/ConsumerRegistrationModal";
import { CheckoutCart } from "app/components/CheckoutCart/CheckoutCart";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { ModalRef } from "delivfree";
import React, { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = AppStackScreenProps<"CheckoutCart">;

export const CheckoutCartScreen = ({ navigation }: Props) => {
  const registrationModal = useRef<ModalRef>(null);

  const insets = useSafeAreaInsets();

  const user = useAppSelector((state) => state.user.user);

  const attemptCheckout = () => {
    if (user?.firstName && user?.lastName && user?.email) {
      handleCheckout();
    } else {
      registrationModal.current?.open();
    }
  };

  const handleRegistration = () => {
    registrationModal.current?.close();
    handleCheckout();
  };

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
      <CheckoutCart onCheckout={attemptCheckout} />
      <ConsumerRegistrationModal
        ref={registrationModal}
        onRegister={handleRegistration}
        title={"Sign up"}
      />
    </Screen>
  );
};
