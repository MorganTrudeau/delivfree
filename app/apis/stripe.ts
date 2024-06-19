import functions from "@react-native-firebase/functions";
import Stripe from "stripe";
import firestore from "@react-native-firebase/firestore";
import {
  SUBSCRIPTION_TRIAL_PERIOD,
  getPositionsPrice,
} from "app/utils/subscriptions";
import { Linking, Platform } from "react-native";
import { Vendor } from "delivfree/types";
import { updateVendor } from "./vendors";
import { navigationRef } from "app/navigators";

export const getStripeAccountBalance = async (
  account: string
): Promise<Stripe.Balance> => {
  const res = await functions().httpsCallable("getAccountBalance")({
    account,
  });
  return res.data;
};

export const verifyStripeAccount = async (
  vendor: Vendor
): Promise<{
  vendor: Vendor;
  stripeAccount: Stripe.Account | undefined;
  isUpdated: boolean;
}> => {
  if (typeof vendor.stripe.accountId !== "string") {
    return { vendor, stripeAccount: undefined, isUpdated: false };
  }

  const stripeAccount = await getStripeAccount(vendor.stripe.accountId);
  const { details_submitted, payouts_enabled } = stripeAccount;
  const { detailsSubmitted, payoutsEnabled } = vendor.stripe;

  if (
    details_submitted !== detailsSubmitted ||
    payouts_enabled !== payoutsEnabled
  ) {
    const updatedVendor = {
      ...vendor,
      stripe: {
        ...vendor.stripe,
        detailsSubmitted: details_submitted,
        payoutsEnabled: payouts_enabled,
      },
    };
    return { vendor: updatedVendor, stripeAccount, isUpdated: true };
  } else {
    return { vendor, stripeAccount, isUpdated: false };
  }
};

export const createStripeAccount = async (vendor: Vendor): Promise<string> => {
  const res = await functions().httpsCallable("createAccount")({
    email: vendor.email,
    companyPhone: vendor.callingCode + vendor.phoneNumber,
    companyName: vendor.businessName,
  });

  if (res.data.account) {
    await updateVendor(vendor.id, {
      stripe: { ...vendor.stripe, accountId: res.data.account },
    });
  } else {
    throw "missing account";
  }

  return res.data.account;
};

export const createStripeCheckoutSession = async (
  params: Stripe.Checkout.SessionCreateParams
): Promise<Stripe.Checkout.Session> => {
  const res = await functions().httpsCallable("createCheckoutSession")(params);
  return res.data;
};

export const getStripeAccount = async (
  account: string
): Promise<Stripe.Account> => {
  const res = await functions().httpsCallable("retrieveAccount")({
    account,
  });
  return res.data;
};

export const getTaxRate = async (taxRate: string): Promise<Stripe.TaxRate> => {
  const res = await functions().httpsCallable("retrieveTaxRate")({
    taxRate,
  });
  return res.data;
};

export const createTaxRate = async (
  params: Stripe.TaxRateCreateParams
): Promise<Stripe.TaxRate> => {
  const res = await functions().httpsCallable("createTaxRate")(params);
  return res.data;
};

export const updateTaxRate = async (
  taxRate: string,
  update: Stripe.TaxRateUpdateParams
): Promise<Stripe.TaxRate> => {
  const res = await functions().httpsCallable("updateTaxRate")({
    taxRate,
    update,
  });
  return res.data;
};

export const createStripeAccountLink = async (
  account: string
): Promise<Stripe.AccountLink> => {
  const url =
    Platform.OS === "web"
      ? __DEV__
        ? window.location.origin
        : "https://delivfree-vendor.web.app/"
      : "https://mobileredirect-5vakg2iqja-uc.a.run.app";
  const res = await functions().httpsCallable("createAccountLink")({
    account,
    returnUrl: url,
    refreshUrl: url,
  });
  return res.data;
};

export const createStripeLogin = async (
  account: string
): Promise<Stripe.LoginLink> => {
  const res = await functions().httpsCallable("createAcountLoginLink")({
    account,
  });
  return res.data;
};

export const createStripePayment = async (
  account: string
): Promise<Stripe.LoginLink> => {
  const res = await functions().httpsCallable("createPayment")({
    account,
  });
  return res.data;
};

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
  subscription: Stripe.Subscription | null | undefined,
  freeTrial: boolean
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

  console.log(subscription);

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
      },
      return_url:
        Platform.OS === "web"
          ? __DEV__
            ? window.location.origin
            : "https://delivfree-vendor.web.app/"
          : "https://mobileredirect-5vakg2iqja-uc.a.run.app", // "delivfree://subscription", // @todo change
      mode: "subscription",
      ui_mode: "embedded",
      customer_email: userEmail || undefined,
    };
    if (freeTrial && params.subscription_data) {
      params.subscription_data.trial_period_days = SUBSCRIPTION_TRIAL_PERIOD;
    }
    const session = await createStripeCheckoutSession(params);
    if (session && session.client_secret) {
      navigationRef.current?.navigate("Payment", {
        clientSecret: session.client_secret,
      });
    }
  }
};
