import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import {
  fetchPaymentSheet,
  fetchSubscriptionPaymentSheet,
  updateSubscription,
} from "app/apis/stripe";
import { useCallback } from "react";
import { OnCheckout, OnSubscribe, UseCheckout, UseCheckoutParams } from "..";
import { AppearanceParams } from "@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet";
import { colors } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import Stripe from "stripe";
import { SUBSCRIPTION_TRIAL_PERIOD } from "app/utils/subscriptions";

export const useCheckout: UseCheckout = ({
  onPaymentSuccess,
}: UseCheckoutParams) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = useCallback(
    async ({
      clientSecret,
      ephemeralKey,
      customerId,
    }: {
      clientSecret: string;
      ephemeralKey: string;
      customerId: string;
    }) => {
      const { error } = await initPaymentSheet({
        merchantDisplayName: "DelivFree Canada Inc.",
        customerId: customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: false,
        appearance: apperance,
        returnURL: "https://mobileredirect-5vakg2iqja-uc.a.run.app",
      });

      if (error) {
        console.log(error);
      }

      return { error };
    },
    []
  );

  const fetchPaymentSheetParams = async ({
    stripeAccount,
    email,
    metadata,
    amount,
    currency,
  }: {
    stripeAccount: string;
    email: string;
    metadata: { [key: string]: string };
    amount: number;
    currency: string;
  }) => {
    const _amount = Number((amount * 100).toFixed(0));
    const response = await fetchPaymentSheet({
      customerData: { email },
      params: {
        amount: _amount,
        currency,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
        transfer_data: {
          destination: stripeAccount,
        },
        metadata,
      },
    });

    const { clientSecret, ephemeralKey, customerId } = response;

    return {
      clientSecret,
      ephemeralKey,
      customerId,
    };
  };

  const fetchSubscriptionSheetParams = async ({
    email,
    items,
    metadata,
    freeTrial,
  }: {
    email: string;
    items: Stripe.SubscriptionCreateParams["items"];
    metadata: { [key: string]: string };
    freeTrial: boolean;
  }) => {
    const params: Omit<Stripe.SubscriptionCreateParams, "customer"> = {
      items,
      metadata,
    };

    if (freeTrial) {
      params.trial_period_days = SUBSCRIPTION_TRIAL_PERIOD;
    }

    const response = await fetchSubscriptionPaymentSheet({
      customerData: { email },
      params: params,
    });

    const { clientSecret, ephemeralKey, customerId } = response;

    return {
      clientSecret,
      ephemeralKey,
      customerId,
    };
  };

  const onCheckout: OnCheckout = useCallback(
    async ({ email, stripeAccount, metadata, currency, amount }) => {
      const { clientSecret, ephemeralKey, customerId } =
        await fetchPaymentSheetParams({
          stripeAccount,
          email,
          metadata,
          currency,
          amount,
        });
      const { error: initError } = await initializePaymentSheet({
        clientSecret,
        ephemeralKey,
        customerId,
      });
      if (initError) {
        throw "init-error";
      }
      const { error: presentError } = await presentPaymentSheet();
      if (presentError && presentError.code !== PaymentSheetError.Canceled) {
        throw "present-error";
      }
      if (!presentError) {
        onPaymentSuccess();
      }
    },
    [initializePaymentSheet]
  );

  const onSubscribe: OnSubscribe = useCallback(
    async ({ lineItems, freeTrial, subscription, email, metadata }) => {
      const _items: Stripe.SubscriptionCreateParams["items"] = lineItems.map(
        (lineItem) => ({ price: lineItem.price, quantity: lineItem.quantity })
      );

      if (
        subscription &&
        subscription.default_payment_method &&
        subscription.status !== "canceled"
      ) {
        await updateSubscription(subscription, _items, metadata);
        onPaymentSuccess();
      } else {
        const { clientSecret, ephemeralKey, customerId } =
          await fetchSubscriptionSheetParams({
            email,
            metadata,
            items: _items,
            freeTrial,
          });

        const { error: initError } = await initializePaymentSheet({
          clientSecret,
          ephemeralKey,
          customerId,
        });
        if (initError) {
          console.log(initError);
          throw "init-error";
        }
        const { error: presentError } = await presentPaymentSheet();
        if (presentError && presentError.code !== PaymentSheetError.Canceled) {
          console.log(presentError);
          throw "present-error";
        }
        if (!presentError) {
          onPaymentSuccess();
        }
      }
    },
    []
  );

  return { onCheckout, onSubscribe };
};

const apperance: AppearanceParams = {
  colors: {
    background: colors.background,
    primary: colors.primary,
    primaryText: colors.text,
    placeholderText: colors.textDim,
    componentText: colors.text,
    secondaryText: colors.text,
    icon: colors.primary,
    componentBackground: colors.palette.neutral200,
    componentBorder: colors.border,
    componentDivider: colors.borderLight,
  },
  shapes: { borderRadius: borderRadius.md },
  primaryButton: {},
};
