import { CheckoutItem, DeliveryInstructionsType } from "delivfree";
import Stripe from "stripe";

export const calcCheckoutItemPrice = (item: CheckoutItem) =>
  (Number(item.item.price) + calcCheckoutItemCustomizationPrice(item)) *
  item.quantity;

export const calcCheckoutItemCustomizationPrice = (item: CheckoutItem) =>
  item.customizations.reduce((acc, choice) => {
    if (choice.type === "note") {
      return acc;
    }
    return acc + (Number(choice.choice.price) || 0) * choice.quantity;
  }, 0);

export const calcCheckoutOrderSubtotal = (items: CheckoutItem[]) => {
  return items.reduce((subtotalAcc, item) => {
    const itemPrice = calcCheckoutItemPrice(item);
    return subtotalAcc + itemPrice;
  }, 0);
};

export const getCheckoutItemCustomizationDesc = (item: CheckoutItem) =>
  item.customizations.length
    ? item.customizations
        .filter((c) => c.type === "choice")
        .map((c) => `${c.choice.name} x ${c.quantity}`)
        .join(", ")
    : undefined;

export const getDeliveryInstructionsTitle = (
  deliveryInstructionsType: DeliveryInstructionsType | null | undefined
) => {
  switch (deliveryInstructionsType) {
    case "meet-door":
      return "Meet at door";
    case "meet-lobby":
      return "Meet in lobby";
    case "meet-outside":
      return "Meet outside";
    case "other":
      return "Other";
    default:
      return "Meet at door";
  }
};

export const checkoutItemsStripeLineItems = (
  items: CheckoutItem[],
  tip: number,
  currency: string,
  taxRate?: string
): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  const lineItems = items.map((item) => {
    const price =
      Number(item.item.price) + calcCheckoutItemCustomizationPrice(item);
    const description = getCheckoutItemCustomizationDesc(item);
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency,
        product_data: {
          name: item.item.name,
        },
        unit_amount: Number(price.toFixed(2)) * 100,
        tax_behavior: "exclusive",
      },
      quantity: item.quantity,
    };
    if (taxRate) {
      lineItem.tax_rates = [taxRate];
    }
    if (lineItem.price_data?.product_data && description) {
      lineItem.price_data.product_data.description = description;
    }
    return lineItem;
  });

  const taxLineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    price_data: {
      currency,
      product_data: {
        name: "Tip",
      },
      unit_amount: Number(tip.toFixed(2)) * 100,
    },
    quantity: 1,
  };

  lineItems.push(taxLineItem);

  return lineItems;
};
