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

const stripePromise = loadStripe(
  "pk_test_51P5xHH076A0nkV3SRDnuCLj3BmRHmwlz6xsFcG8ORd5Gdc1tVzbsTJQKmKmmuL2A6W3nPDHTklD8oRpFmMmRloiI00JMw181zS"
);

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
    <Screen style={$screen} contentContainerStyle={$containerPadding}>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </Screen>
  );
};
