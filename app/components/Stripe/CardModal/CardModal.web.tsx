import React, { forwardRef, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  PaymentMethodResult,
  Stripe as StripeJS,
  loadStripe,
} from "@stripe/stripe-js";
import { attachPaymentMethod } from "../../../apis/stripe";
import { StyleProp, ViewStyle } from "react-native";
import { stripeApiKey } from "../../../../app.json";
import { useToast } from "app/hooks";
import ReanimatedCenterModal from "app/components/Modal/CenterModal";
import { ModalRef } from "delivfree";
import { Text } from "app/components/Text";
import { Button } from "app/components/Button";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { spacing } from "app/theme";

type PaymentMethod = PaymentMethodResult["paymentMethod"];

type CardInputElementProps = {
  onPaymentMethodCreated?: (paymentMethod: PaymentMethod) => void;
  onPaymentMethodFailed?: (error: string) => void;
  saveOnCreate?: boolean;
  directCheckout?: boolean;
  handleCreateCharge?: (token: any) => void;
  waitUntilAttached?: boolean;
  formattedAmount?: string;
  onCancel: () => void;
  customer: string;
  subscription: string;
};

export const CardInputElement = ({
  saveOnCreate = true,
  onPaymentMethodCreated,
  onPaymentMethodFailed,
  handleCreateCharge,
  onCancel,
  customer,
  subscription
}: CardInputElementProps & any) => {
  const stripe = useStripe();
  const elements = useElements();

  const Toast = useToast();

  const [loading, setLoading] = useState(false);
  const [paymentMethodPendingAttach, setPaymethodPendingAttach] = useState<
    PaymentMethodResult["paymentMethod"] | null
  >(null);

  const onSuccess = (paymentMethod: PaymentMethod) => {
    if (typeof onPaymentMethodCreated === "function") {
      onPaymentMethodCreated(paymentMethod);
    }
    Toast.show("Card add successfully");
    setLoading(false);
  };

  const onFailure = (
    error:
      | "card_declined"
      | "expired_card"
      | "incorrect_cvc"
      | "processing_error"
      | "incorrect_number"
      | string
  ) => {
    if (typeof onPaymentMethodFailed === "function") {
      onPaymentMethodFailed(error);
    }

    let errorMessage = "Add card failure";

    Toast.show(errorMessage);
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    let cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return Toast.show("Add card failure");
    }

    stripe
      .createPaymentMethod({
        type: "card",
        card: cardElement,
      })
      .then(async ({ paymentMethod }: { paymentMethod?: PaymentMethod }) => {
        if (paymentMethod && paymentMethod.id) {
          if (saveOnCreate) {
            setPaymethodPendingAttach(paymentMethod);
            await attachPaymentMethod(customer, subscription, paymentMethod.id);
            onSuccess(paymentMethod);
          } else {
            onSuccess(paymentMethod);
          }
          return paymentMethod;
        } else {
          setLoading(false);
          return null;
        }
      })
      .catch((error: any) => {
        console.log("Failed to create payment method", error);
        Toast.show("Add card failure");
        setLoading(false);
        onFailure(error);
      });
  };

  const Loading = useLoadingIndicator(loading);

  return (
    <div style={{ padding: spacing.md }}>
      <Text preset="subheading">Enter card details</Text>

      <div style={{ marginTop: spacing.md }}>
        <CardElement onReady={(el: any) => el.focus()} />
      </div>

      <Button
        preset={"filled"}
        text={"Confirm"}
        style={{ marginTop: spacing.lg, alignSelf: "stretch", width: "100%" }}
        RightAccessory={Loading}
        onPress={handleSubmit}
      />
    </div>
  );
};

let _stripePromise: Promise<StripeJS | null>;
const getStripePromise = () => {
  if (!_stripePromise) {
    _stripePromise = loadStripe(stripeApiKey);
  }
  return _stripePromise;
};

export const CardInput = (props: CardInputElementProps) => {
  return (
    <Elements stripe={getStripePromise()}>
      <CardInputElement {...props} />
    </Elements>
  );
};

export type CardModalProps = {
  directCheckout?: boolean;
  handleCreateCharge?: (token: any) => void;
  modalStyle?: StyleProp<ViewStyle>;
} & CardInputElementProps;

const CardModal = forwardRef<ModalRef, CardModalProps>(function CardModal(
  props,
  ref
) {
  return (
    <ReanimatedCenterModal ref={ref}>
      <CardInput {...props} />
    </ReanimatedCenterModal>
  );
});

export default CardModal;
