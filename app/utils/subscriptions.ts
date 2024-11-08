import { Linking } from "react-native";
import Stripe from "stripe";

export const FULL_TIME_ORDERS = 24;
export const PART_TIME_ORDERS = 12;
export const SUBSCRIPTION_TRIAL_PERIOD = 60;

const devPrices = {
  vendor: {
    fullTime: "price_1PN8Eq076A0nkV3SqdXnai9z",
    partTime: "price_1PN8Fe076A0nkV3SxcGFsZpM",
  },
  driver: {
    fullTime: "price_1P5yoJ076A0nkV3S5AURCebc",
    partTime: "price_1P6Pln076A0nkV3SQRuZl37f",
  },
};
const livePrices = {
  vendor: {
    fullTime: "price_1QIwz7076A0nkV3SoDVSWj3F",
    partTime: "price_1QIx1W076A0nkV3SoacMzSq1",
  },
  driver: {
    fullTime: "price_1QIx2l076A0nkV3SGC1cWMEj",
    partTime: "price_1QIx3J076A0nkV3SUMMp7FHx",
  },
};
const prices = livePrices;

export const getPositionsPrice = (
  userType: "driver" | "vendor",
  positionsType: "fullTime" | "partTime"
) => {
  if (userType === "driver") {
    return positionsType === "fullTime"
      ? prices.driver.fullTime
      : prices.driver.partTime;
  } else {
    return positionsType === "fullTime"
      ? prices.vendor.fullTime
      : prices.vendor.partTime;
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
        price === prices.driver.fullTime ||
        price === prices.vendor.fullTime
      ) {
        acc.fullTime = acc.fullTime + (item.quantity || 0);
      } else if (
        price === prices.driver.partTime ||
        price === prices.vendor.partTime
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
