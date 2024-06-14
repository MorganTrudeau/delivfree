import { CheckoutItem } from "app/redux/reducers/checkoutCart";

export const calcCheckoutOrderSubtotal = (items: CheckoutItem[]) => {
  return items.reduce((subtotalAcc, item) => {
    const itemPrice =
      Number(item.item.price) * item.quantity +
      item.customizations.reduce((acc, choice) => {
        return acc + (Number(choice.choice.price) || 0) * choice.quantity;
      }, 0);

    return subtotalAcc + itemPrice;
  }, 0);
};
