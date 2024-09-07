import React, { useEffect, useRef, useState } from "react";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import CardModal from "./CardModal/CardModal.web";
import Stripe from "stripe";
import { retrievePaymentMethod } from "app/apis/stripe";
import { PaymentMethodItem } from "./PaymentMethodItem";
import { ModalRef } from "delivfree";

export const PaymentMethodSelectButton = ({
  cardStyle,
  cardTitleStyle,
  cardSubtitleStyle,
  cardIconStyle,
  cardIconColor,
  style,
  customer,
  subscription,
  defaultPaymentMethod,
}: {
  cardStyle?: ViewStyle;
  cardTitleStyle?: TextStyle;
  cardSubtitleStyle?: TextStyle;
  cardIconStyle?: ViewStyle;
  cardIconColor?: string;
  style?: ViewStyle;
  customer: string;
  subscription: string;
  defaultPaymentMethod: string | undefined | null;
}) => {
  const cardModal = useRef<ModalRef>(null);

  const [{ paymentMethod, paymentMethodLoading }, setState] = useState<{
    paymentMethod: Stripe.PaymentMethod | undefined;
    paymentMethodLoading: boolean;
  }>({
    paymentMethod: undefined,
    paymentMethodLoading: true,
  });

  useEffect(() => {
    const loadPaymentMethod = async (id: string) => {
      try {
        setState((s) => ({ ...s, paymentMethodLoading: true }));
        const _paymentMethod = await retrievePaymentMethod(id);
        setState((s) => ({
          ...s,
          paymentMethod: _paymentMethod,
          paymentMethodLoading: false,
        }));
      } catch (error) {
        console.log(error);
        setState((s) => ({
          ...s,
          paymentMethodLoading: false,
        }));
      }
    };
    if (defaultPaymentMethod) {
      loadPaymentMethod(defaultPaymentMethod);
    }
  }, [defaultPaymentMethod]);

  useEffect(() => {
    const loadPaymentMethods = () => {};
    loadPaymentMethods();
  }, []);

  console.log(defaultPaymentMethod, defaultPaymentMethod);

  const closeCardModal = () => cardModal.current?.close();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          cardModal.current?.open();
        }}
        style={style}
      >
        <PaymentMethodItem
          paymentMethod={paymentMethod}
          style={cardStyle}
          titleStyle={cardTitleStyle}
          subtitleStyle={cardSubtitleStyle}
          iconStyle={cardIconStyle}
          iconColor={cardIconColor}
          loading={paymentMethodLoading}
        />
      </TouchableOpacity>
      <CardModal
        ref={cardModal}
        customer={customer}
        subscription={subscription}
        onCancel={closeCardModal}
        onPaymentMethodCreated={closeCardModal}
      />
    </>
  );
};
