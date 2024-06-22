import Stripe from "stripe";

export type UseCheckoutParams = {
  onPaymentSuccess: () => void;
};
export type OnCheckout = (params: {
  email: string;
  amount: number;
  currency: string;
  stripeAccount: string;
  lineItems: Array<Stripe.Checkout.SessionCreateParams.LineItem>;
  metadata: { [key: string]: string };
}) => Promise<void>;

export type OnSubscribe = (params: {
  email: string;
  lineItems: Array<Stripe.Checkout.SessionCreateParams.LineItem>;
  freeTrial: boolean;
  subscription: Stripe.Subscription | null | undefined;
  metadata: { [key: string]: string };
}) => Promise<void>;

export type UseCheckout = (params: UseCheckoutParams) => {
  onCheckout: OnCheckout;
  onSubscribe: OnSubscribe;
};

export { useCheckout } from "./useCheckout";
