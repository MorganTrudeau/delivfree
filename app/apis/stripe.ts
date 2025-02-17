import functions from "@react-native-firebase/functions";
import Stripe from "stripe";
import firestore from "@react-native-firebase/firestore";
import {
  SUBSCRIPTION_TRIAL_PERIOD,
  getPositionsPrice,
} from "app/utils/subscriptions";
import { Platform } from "react-native";
import { Vendor, VENDOR_DOMAIN } from "delivfree";
import { updateVendor } from "./vendors";
import { navigationRef } from "app/navigators";

export const getCustomer = async (
  customer: string
): Promise<Stripe.Customer> => {
  const res = await functions().httpsCallable<
    { customer: string },
    Stripe.Customer
  >("retrieveCustomer")({
    customer,
  });
  return res.data;
};

export const retrieveCustomerPaymentMethods = async (
  customer: string
): Promise<Stripe.PaymentMethod[]> => {
  const res = await functions().httpsCallable<
    { customer: string },
    Stripe.PaymentMethod[]
  >("retrieveCustomerPaymentMethods")({
    customer,
  });
  return res.data;
};

export const retrievePaymentMethod = async (
  paymentMethod: string
): Promise<Stripe.PaymentMethod> => {
  const res = await functions().httpsCallable<
    { paymentMethod: string },
    Stripe.PaymentMethod
  >("retrievePaymentMethod")({
    paymentMethod,
  });
  return res.data;
};

export const attachPaymentMethod = async (
  customer: string,
  subscription: string,
  paymentMethod: string
): Promise<Stripe.PaymentMethod> => {
  const res = await functions().httpsCallable<
    { customer: string; paymentMethod: string; subscription: string },
    Stripe.PaymentMethod
  >("attachPaymentMethod")({
    customer,
    paymentMethod,
    subscription,
  });
  return res.data;
};

export const getStripeAccountBalance = async (
  account: string
): Promise<Stripe.Balance> => {
  const res = await functions().httpsCallable<
    { account: string },
    Stripe.Balance
  >("getAccountBalance")({
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
  const { details_submitted, payouts_enabled, requirements } = stripeAccount;
  const { detailsSubmitted, payoutsEnabled, accountPending, actionsDue } =
    vendor.stripe;

  const pending = !!requirements?.pending_verification?.length;
  const due = !!requirements?.currently_due?.length;

  if (
    details_submitted !== detailsSubmitted ||
    payouts_enabled !== payoutsEnabled ||
    accountPending !== pending ||
    actionsDue !== due
  ) {
    const updatedVendor = {
      ...vendor,
      stripe: {
        ...vendor.stripe,
        detailsSubmitted: details_submitted,
        payoutsEnabled: payouts_enabled,
        actionsDue: due,
        accountPending: pending,
      },
    };
    return { vendor: updatedVendor, stripeAccount, isUpdated: true };
  } else {
    return { vendor, stripeAccount, isUpdated: false };
  }
};

export const createStripeAccount = async (vendor: Vendor): Promise<string> => {
  const res = await functions().httpsCallable<
    {
      email: string;
      companyPhone: string;
      companyName: string;
    },
    { account: string }
  >("createAccount")({
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
  const res = await functions().httpsCallable<
    Stripe.Checkout.SessionCreateParams,
    Stripe.Checkout.Session
  >("createCheckoutSession")(params);
  return res.data;
};

export const getStripeAccount = async (
  account: string
): Promise<Stripe.Account> => {
  const res = await functions().httpsCallable<
    { account: string },
    Stripe.Account
  >("retrieveAccount")({
    account,
  });
  return res.data;
};

export const getTaxRate = async (taxRate: string): Promise<Stripe.TaxRate> => {
  const res = await functions().httpsCallable<
    { taxRate: string },
    Stripe.TaxRate
  >("retrieveTaxRate")({
    taxRate,
  });
  return res.data;
};

export const createTaxRate = async (
  params: Stripe.TaxRateCreateParams
): Promise<Stripe.TaxRate> => {
  const res = await functions().httpsCallable<
    Stripe.TaxRateCreateParams,
    Stripe.TaxRate
  >("createTaxRate")(params);
  return res.data;
};

export const updateTaxRate = async (
  taxRate: string,
  update: Stripe.TaxRateUpdateParams
): Promise<Stripe.TaxRate> => {
  const res = await functions().httpsCallable<
    {
      taxRate: string;
      update: Stripe.TaxRateUpdateParams;
    },
    Stripe.TaxRate
  >("updateTaxRate")({
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
        : VENDOR_DOMAIN
      : "https://mobileredirect-5vakg2iqja-uc.a.run.app";
  const res = await functions().httpsCallable<
    {
      account: string;
      returnUrl: string;
      refreshUrl: string;
    },
    Stripe.AccountLink
  >("createAccountLink")({
    account,
    returnUrl: url,
    refreshUrl: url,
  });
  return res.data;
};

export const createStripeLogin = async (
  account: string
): Promise<Stripe.LoginLink> => {
  const res = await functions().httpsCallable<
    { account: string },
    Stripe.LoginLink
  >("createAcountLoginLink")({
    account,
  });
  return res.data;
};

export const createStripePayment = async (
  account: string
): Promise<Stripe.LoginLink> => {
  const res = await functions().httpsCallable<
    { account: string },
    Stripe.LoginLink
  >("createPayment")({
    account,
  });
  return res.data;
};

export const fetchSubscription = async (userId: string) => {
  const doc = await firestore().collection("Subscriptions").doc(userId).get();
  return doc.data()?.subscription as Stripe.Subscription | undefined;
};

export const fetchProducts = async () => {
  const res = await functions().httpsCallable<
    { params: Stripe.ProductListParams },
    Stripe.ApiList<Stripe.Product>
  >("fetchProducts")({
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
            : VENDOR_DOMAIN
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

export const updateSubscription = async (
  subscription: Stripe.Subscription,
  lineItems: Stripe.SubscriptionCreateParams.Item[],
  metadata: { [key: string]: string }
) => {
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
};

type FetchPaymentSheetParams = {
  customerData: {
    email: string;
  };
  params: Stripe.PaymentIntentCreateParams;
};
type FetchPaymentSheetResponse = {
  ephemeralKey: string;
  clientSecret: string;
  customerId: string;
};
export const fetchPaymentSheet = async ({
  customerData,
  params,
}: FetchPaymentSheetParams): Promise<FetchPaymentSheetResponse> => {
  const res = await functions().httpsCallable<
    FetchPaymentSheetParams,
    FetchPaymentSheetResponse
  >("fetchPaymentSheet")({
    customerData,
    params,
  });
  return res.data;
};

type FetchSubscriptionPaymentSheetParams = {
  customerData: {
    email: string;
  };
  params: Omit<Stripe.SubscriptionCreateParams, "customer">;
};
type FetchSubscriptionPaymentSheetResponse = {
  ephemeralKey: string;
  clientSecret: string;
  customerId: string;
};
export const fetchSubscriptionPaymentSheet = async ({
  customerData,
  params,
}: FetchSubscriptionPaymentSheetParams): Promise<FetchSubscriptionPaymentSheetResponse> => {
  const res = await functions().httpsCallable<
    FetchSubscriptionPaymentSheetParams,
    FetchSubscriptionPaymentSheetResponse
  >("fetchSubscriptionPaymentSheet")({
    customerData,
    params,
  });
  return res.data;
};
