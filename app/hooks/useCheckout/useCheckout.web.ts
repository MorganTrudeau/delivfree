import {
  createStripeCheckoutSession,
  updateSubscription,
} from "app/apis/stripe";
import { navigationRef } from "app/navigators";
import {
  OnCheckout,
  OnSubscribe,
  UseCheckout,
  UseCheckoutParams,
} from "./index";
import Stripe from "stripe";
import { SUBSCRIPTION_TRIAL_PERIOD } from "app/utils/subscriptions";
import functions from "@react-native-firebase/functions";
import { useCallback } from "react";
import { VENDOR_DOMAIN } from "functions/src/types";

export const useCheckout: UseCheckout = ({}: UseCheckoutParams) => {
  const onCheckout: OnCheckout = async ({
    email,
    stripeAccount,
    lineItems,
    metadata,
  }) => {
    if (!stripeAccount) {
      throw "missing-account";
    }

    const session = await createStripeCheckoutSession({
      line_items: lineItems,
      payment_intent_data: {
        application_fee_amount: 0,
        transfer_data: {
          destination: stripeAccount,
        },
      },
      mode: "payment",
      ui_mode: "embedded",
      customer_email: email,
      redirect_on_completion: "never",
      metadata,
    });

    if (session && session.client_secret) {
      navigationRef.current?.navigate("Payment", {
        clientSecret: session.client_secret,
      });
    }
  };

  const onSubscribe: OnSubscribe = useCallback(
    async ({ lineItems, freeTrial, subscription, email, metadata }) => {
      if (
        subscription &&
        subscription.default_payment_method &&
        subscription.status !== "canceled"
      ) {
        const _items: Stripe.SubscriptionCreateParams["items"] = lineItems.map(
          (lineItem) => ({ price: lineItem.price, quantity: lineItem.quantity })
        );
        await updateSubscription(subscription, _items, metadata);
      } else {
        const params: Stripe.Checkout.SessionCreateParams = {
          line_items: lineItems,
          subscription_data: {
            metadata,
          },
          return_url: __DEV__ ? window.location.origin : VENDOR_DOMAIN,
          mode: "subscription",
          ui_mode: "embedded",
          customer_email: email || undefined,
        };
        if (freeTrial && params.subscription_data) {
          params.subscription_data.trial_period_days =
            SUBSCRIPTION_TRIAL_PERIOD;
        }
        const session = await createStripeCheckoutSession(params);
        if (session && session.client_secret) {
          navigationRef.current?.navigate("Payment", {
            clientSecret: session.client_secret,
          });
        }
      }
    },
    []
  );

  return { onCheckout, onSubscribe };
};
