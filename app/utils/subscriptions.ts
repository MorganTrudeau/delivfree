import Stripe from "stripe";

export const FULL_TIME_ORDERS = 24;
export const SURGE_ORDERS = 12;

export const subscriptionsInSync = (
  subscriptionA: Stripe.Subscription,
  subscriptionB: Stripe.Subscription
) => {
  return subscriptionA.items.data.every(
    (itemA) =>
      !!subscriptionB.items.data.find(
        (itemB) =>
          itemB.plan.id === itemA.plan.id && itemB.quantity === itemA.quantity
      )
  );
};

export const maxOrdersForSubscription = (subscription: Stripe.Subscription) => {
  const fullTimeOrderItem = subscription.items.data.find(isFullTimeOrderItem);
  const surgeOrderItem = subscription.items.data.find(isSurgeOrderItem);

  return (
    (fullTimeOrderItem?.quantity || 0) * FULL_TIME_ORDERS +
    (surgeOrderItem?.quantity || 0) * SURGE_ORDERS
  );
};

export const isFullTimeOrderItem = (item: Stripe.SubscriptionItem) => {
  return item.price.product === "prod_PvqVStGqKEDOhB";
};

export const isSurgeOrderItem = (item: Stripe.SubscriptionItem) => {
  return item.price.product === "prod_PwIMdMjpdkX6BU";
};
