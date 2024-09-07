import Stripe from "stripe";
import DefaultCardSVG from "../../assets/svg/cards/default.svg";
import VisaSVG from "../../assets/svg/cards/visa.svg";
import MastercardSVG from "../../assets/svg/cards/mastercard.svg";
import AmexSVG from "../../assets/svg/cards/amex.svg";
import DiscoverSVG from "../../assets/svg/cards/discover.svg";
import DinersSVG from "../../assets/svg/cards/diners.svg";
import JcbSVG from "../../assets/svg/cards/jcb.svg";

export const getDefaultPaymentMethodId = (
  customer: null | undefined | Stripe.Customer
): string | undefined => {
  const data = customer?.invoice_settings?.default_payment_method;

  return data !== null && data !== undefined
    ? typeof data === "string"
      ? data
      : data.id
    : undefined;
};

export const getCardSvg = (cardType: string | undefined) => {
  switch (cardType) {
    case "visa":
      return VisaSVG;
    case "mastercard":
      return MastercardSVG;
    case "amex":
      return AmexSVG;
    case "discover":
      return DiscoverSVG;
    case "diners":
      return DinersSVG;
    case "jcb":
      return JcbSVG;
    default:
      return DefaultCardSVG;
  }
};

export const orderPaymentMethods = (
  paymentMethods: Stripe.PaymentMethod[],
  defaultPaymentMethod: string | null | undefined
) => {
  if (!defaultPaymentMethod) {
    return paymentMethods;
  }

  const ordered = [...paymentMethods];
  const defaultIndex = ordered.findIndex((m) => m.id === defaultPaymentMethod);

  if (!defaultIndex) {
    return paymentMethods;
  }

  const defaultMethod = ordered[defaultIndex];
  ordered.splice(defaultIndex, 1);
  ordered.unshift(defaultMethod);
  return ordered;
};
