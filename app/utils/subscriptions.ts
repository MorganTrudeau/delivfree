import { Linking } from "react-native";
import Stripe from "stripe";

export const FULL_TIME_ORDERS = 24;
export const PART_TIME_ORDERS = 12;
export const SUBSCRIPTION_TRIAL_PERIOD = 60;

// Driver
export const FULL_TIME_DRIVER_PRICE = "price_1P5yoJ076A0nkV3S5AURCebc";
export const PART_TIME_DRIVER_PRICE = "price_1P6Pln076A0nkV3SQRuZl37f";
// Vendor
export const FULL_TIME_VENDOR_PRICE = "price_1PN8Eq076A0nkV3SqdXnai9z";
export const PART_TIME_VENDOR_PRICE = "price_1PN8Fe076A0nkV3SxcGFsZpM";

export const getPositionsPrice = (
  userType: "driver" | "vendor",
  positionsType: "fullTime" | "partTime"
) => {
  if (userType === "driver") {
    return positionsType === "fullTime"
      ? FULL_TIME_DRIVER_PRICE
      : PART_TIME_DRIVER_PRICE;
  } else {
    return positionsType === "fullTime"
      ? FULL_TIME_VENDOR_PRICE
      : PART_TIME_VENDOR_PRICE;
  }
};

export const viewSubscriptionOnStripe = (subscription: Stripe.Subscription) => {
  return Linking.openURL(
    `https://dashboard.stripe.com/customers/${subscription.customer}`
  );
};

export const getSubscriptionPrice = (subscription: Stripe.Subscription) => {
  return subscription.items.data.reduce(
    (acc, item) =>
      acc + ((item.price.unit_amount || 0) / 100) * (item.quantity || 0),
    0
  );
};

export const getPositionsFromSubscription = (
  subscription: Stripe.Subscription
) => {
  return subscription.items.data.reduce(
    (acc, item) => {
      const price = item.price.id;
      if (
        price === FULL_TIME_DRIVER_PRICE ||
        price === FULL_TIME_VENDOR_PRICE
      ) {
        acc.fullTime = acc.fullTime + (item.quantity || 0);
      } else if (
        price === PART_TIME_DRIVER_PRICE ||
        price === PART_TIME_VENDOR_PRICE
      ) {
        acc.partTime = acc.partTime + (item.quantity || 0);
      }
      return acc;
    },
    { fullTime: 0, partTime: 0 }
  );
};

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
  const { fullTime: subscribedFullTime, partTime: subscribedPartTime } =
    getPositionsFromSubscription(subscription);

  return (
    subscribedFullTime * FULL_TIME_ORDERS +
    subscribedPartTime * PART_TIME_ORDERS
  );
};

export const isFullTimeOrderItem = (item: Stripe.SubscriptionItem) => {
  return item.price.product === "prod_PvqVStGqKEDOhB";
};

export const isSurgeOrderItem = (item: Stripe.SubscriptionItem) => {
  return item.price.product === "prod_PwIMdMjpdkX6BU";
};
