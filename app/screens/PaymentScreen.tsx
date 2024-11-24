import { Screen } from "app/components";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import React, { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { EmptyList } from "app/components/EmptyList";
import { emptyCart } from "app/redux/reducers/checkoutCart";
import { stripeApiKey } from "../../app.json";

const stripePromise = loadStripe(stripeApiKey);

type Props = AppStackScreenProps<"Payment">;

export const PaymentScreen = (props: Props) => {
  const { clientSecret } = props.route.params;

  const cart = useAppSelector((state) => state.checkoutCart.order);
  const dispatch = useAppDispatch();

  const options = useMemo(
    () => ({
      clientSecret,
      onComplete: () => {
        console.log("Payment completed");
        dispatch(emptyCart());
      },
    }),
    [clientSecret]
  );

  if (!cart?.items) {
    <Screen style={$screen} contentContainerStyle={$containerPadding}>
      <EmptyList icon={"cart"} title={"No items in your cart"} />
    </Screen>;
  }

  return (
    <Screen
      style={$screen}
      contentContainerStyle={$containerPadding}
      preset="scroll"
    >
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </Screen>
  );
};
