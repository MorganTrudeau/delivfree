import functions from "@react-native-firebase/functions";
import Stripe from "stripe";
import firestore from "@react-native-firebase/firestore";
import {
  SUBSCRIPTION_TRIAL_PERIOD,
  getPositionsPrice,
} from "app/utils/subscriptions";
import { Linking, Platform } from "react-native";

export const fetchSubscription = async (userId: string) => {
  const doc = await firestore().collection("Subscriptions").doc(userId).get();
  return doc.data()?.subscription as Stripe.Subscription | undefined;
};

export const fetchProducts = async () => {
  const res = await functions().httpsCallable("fetchProducts")({
    params: { expand: ["data.default_price"] },
  });
  const data: Stripe.ApiList<Stripe.Product> = res.data;
  const vendorFullTimeProduct =
    data.data.find((p) => p.metadata.type === "vendor-full-time") || null;
  const vendorPartTimeProduct =
    data.data.find((p) => p.metadata.type === "vendor-part-time") || null;
  const driverFullTimeProduct =
    data.data.find((p) => p.metadata.type === "driver-full-time") || null;
  const driverPartTimeProduct =
    data.data.find((p) => p.metadata.type === "driver-part-time") || null;
  return {
    vendorFullTime: vendorFullTimeProduct,
    vendorPartTime: vendorPartTimeProduct,
    driverFullTime: driverFullTimeProduct,
    driverPartTime: driverPartTimeProduct,
  };
};

export const subscribe = async (
  userType: "driver" | "vendor",
  userId: string,
  userEmail: string,
  fullTimePostions: number,
  partTimePositions: number,
  subscription: Stripe.Subscription | null | undefined
) => {
  const metadata: { [key: string]: string } = {};

  if (userType === "driver") {
    metadata.driver = userId;
  } else {
    metadata.vendor = userId;
  }

  const fullTimePrice = getPositionsPrice(userType, "fullTime");
  const partTimePrice = getPositionsPrice(userType, "partTime");

  const lineItems: Array<Stripe.Checkout.SessionCreateParams.LineItem> = [];

  if (fullTimePostions) {
    lineItems.push({
      price: fullTimePrice,
      quantity: fullTimePostions,
    });
  }

  if (partTimePositions) {
    lineItems.push({
      price: partTimePrice,
      quantity: partTimePositions,
    });
  }

  if (subscription && subscription.status !== "canceled") {
    const items: Array<Stripe.SubscriptionUpdateParams.Item> = lineItems.map(
      (item) => {
        const subscriptionItem = subscription.items.data.find(
          (i) => i.price.id === item.price
        );
        if (subscriptionItem) {
          return {
            price: item.price,
            quantity: item.quantity,
            id: subscriptionItem.id,
          };
        } else {
          return { price: item.price, quantity: item.quantity };
        }
      }
    );

    subscription.items.data.forEach((item) => {
      if (!items.find((i) => i.price === item.price.id)) {
        items.push({ id: item.id, quantity: 0, price: item.price.id });
      }
    });

    const params: Stripe.SubscriptionUpdateParams = {
      items,
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      cancellation_details: {},
      metadata,
    };
    await functions().httpsCallable("updateSubscription")({
      id: subscription.id,
      params,
    });
  } else {
    const params: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      subscription_data: {
        metadata,
        trial_period_days: SUBSCRIPTION_TRIAL_PERIOD,
      },
      success_url:
        Platform.OS === "web"
          ? __DEV__
            ? "http://localhost:8080"
            : "https://delivfree-vendor.web.app/"
          : "https://mobileredirect-5vakg2iqja-uc.a.run.app", //"delivfree://subscription", // @todo change
      mode: "subscription",
      customer_email: userEmail || undefined,
    };
    const data = await functions().httpsCallable("createCheckoutSession")({
      params,
    });
    Linking.openURL(data.data.url);
    console.log(data.data);
  }
};
