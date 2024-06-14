import { CheckoutItem } from "app/redux/reducers/checkoutCart";
import { DeliveryInstructionsType, User } from "delivfree/types";

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
    default:
      return "Meet at door";
  }
};
