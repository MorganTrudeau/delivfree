import { defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import {
  CallableRequest,
  onCall,
  onRequest,
} from "firebase-functions/v2/https";
import { sendEmailNotification } from "../utils/email";
import { Driver, Vendor } from "../types";

const apiKey = defineString("STRIPE_SECRET_KEY");
const signingSecret = defineString("STRIPE_SIGNING_SECRET");

let _stripe: Stripe;
const getStripe = () => {
  if (!_stripe) {
    _stripe = new Stripe(apiKey.value());
  }
  return _stripe;
};

export const retrieveCustomer = onCall(
  async (data: CallableRequest<{ customer: string }>) => {
    const customer = await getStripe().customers.retrieve(data.data.customer);
    return customer;
  }
);

export const attachPaymentMethod = onCall(
  async (
    data: CallableRequest<{
      paymentMethod: string;
      customer: string;
      subscription: string;
    }>
  ) => {
    const { paymentMethod, customer, subscription } = data.data;
    const method = await getStripe().paymentMethods.attach(paymentMethod, {
      customer,
    });
    await getStripe().subscriptions.update(subscription, {
      default_payment_method: paymentMethod,
    });
    return method;
  }
);

export const retrieveCustomerPaymentMethods = onCall(
  async (data: CallableRequest<{ customer: string }>) => {
    const paymentMethods = await getStripe().customers.listPaymentMethods(
      data.data.customer
    );
    return paymentMethods.data;
  }
);

export const retrievePaymentMethod = onCall(
  async (data: CallableRequest<{ paymentMethod: string }>) => {
    return await getStripe().paymentMethods.retrieve(data.data.paymentMethod);
  }
);

export const createAccount = onCall(
  async (
    data: CallableRequest<{
      email: string;
      companyPhone: string;
      companyName: string;
    }>
  ) => {
    const { companyPhone, companyName, email } = data.data;
    const account = await getStripe().accounts.create({
      email: email,
      business_type: "company",
      company: {
        phone: companyPhone,
        name: companyName,
      },
      controller: {
        fees: {
          payer: "application",
        },
        losses: {
          payments: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
    });

    return {
      account: account.id,
    };
  }
);

export const createAccountLink = onCall(
  async (
    data: CallableRequest<{
      account: string;
      returnUrl: string;
      refreshUrl: string;
    }>
  ) => {
    const { account, refreshUrl, returnUrl } = data.data;

    const accountLink = await getStripe().accountLinks.create({
      account: account,
      return_url: returnUrl,
      refresh_url: refreshUrl,
      type: "account_onboarding",
    });

    return accountLink;
  }
);

export const createCheckoutSession = onCall(
  async (data: CallableRequest<Stripe.Checkout.SessionCreateParams>) => {
    return await getStripe().checkout.sessions.create(data.data);
  }
);

export const retrieveTaxRate = onCall(
  async (data: CallableRequest<{ taxRate: string }>) => {
    return await getStripe().taxRates.retrieve(data.data.taxRate);
  }
);

export const createTaxRate = onCall(
  async (data: CallableRequest<Stripe.TaxRateCreateParams>) => {
    return await getStripe().taxRates.create(data.data);
  }
);

export const updateTaxRate = onCall(
  async (
    data: CallableRequest<{
      taxRate: string;
      update: Stripe.TaxRateUpdateParams;
    }>
  ) => {
    const { taxRate, update } = data.data;
    return await getStripe().taxRates.update(taxRate, update);
  }
);

export const retrieveAccount = onCall(
  async (
    data: CallableRequest<{
      account: string;
    }>
  ) => {
    const { account } = data.data;
    return await getStripe().accounts.retrieve(account);
  }
);

export const createAcountLoginLink = onCall(
  async (
    data: CallableRequest<{
      account: string;
    }>
  ) => {
    const { account } = data.data;
    return await getStripe().accounts.createLoginLink(account);
  }
);

export const getAccountBalance = onCall(
  async (data: CallableRequest<{ account: string }>) => {
    return await getStripe().balance.retrieve({
      stripeAccount: data.data.account,
    });
  }
);

export const createPayout = onCall(
  async (data: CallableRequest<{ account: string }>) => {
    const { account } = data.data;

    const stripe = getStripe();

    const balance = await stripe.balance.retrieve({
      stripeAccount: account,
    });
    // This demo app only uses USD so we'll just use the first available balance
    // (Note: there is one balance for each currency used in your application)
    const { amount, currency } = balance.available[0];
    // Create a payout
    return await stripe.payouts.create(
      {
        amount: amount,
        currency: currency,
        statement_descriptor: "DelivFree",
      },
      { stripeAccount: account }
    );
  }
);

export const createSubscription = onCall(
  async (
    data: CallableRequest<{ params: Stripe.SubscriptionCreateParams }>
  ) => {
    return await getStripe().subscriptions.create(data.data.params);
  }
);

export const updateSubscription = onCall(
  async (
    data: CallableRequest<{
      id: string;
      params: Stripe.SubscriptionUpdateParams;
    }>
  ) => {
    return await getStripe().subscriptions.update(
      data.data.id,
      data.data.params
    );
  }
);

export const fetchSubscriptions = onCall(
  async (data: CallableRequest<{ params: Stripe.SubscriptionListParams }>) => {
    return await getStripe().subscriptions.list(data.data.params);
  }
);

export const fetchProducts = onCall(
  async (data: CallableRequest<{ params: Stripe.ProductListParams }>) => {
    return await getStripe().products.list(data.data.params);
  }
);

export const loadCheckoutSession = onCall(
  async (data: CallableRequest<{ id: string }>) => {
    return await getStripe().checkout.sessions.retrieve(data.data.id);
  }
);

export const stripeWebhook = onRequest(async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = getStripe().webhooks.constructEvent(
        req.rawBody,
        sig,
        signingSecret.value()
      );
    } catch (err) {
      console.error(err);
      // @ts-ignore
      res.status(400).send(`Webhook Error: ${err?.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
      case "checkout.session.completed": {
        console.log(event.type, event.data.object);

        const orderId = event.data.object.metadata?.orderId;
        if (orderId) {
          const pendingOrderRef = admin
            .firestore()
            .collection("PendingOrders")
            .doc(orderId);
          const pendingOrderDoc = await pendingOrderRef.get();
          const pendingOrder = pendingOrderDoc.data();
          if (pendingOrder) {
            await admin
              .firestore()
              .collection("Orders")
              .doc(pendingOrder.id)
              .set(pendingOrder);
            await pendingOrderRef.delete();
          }
        }
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        // @ts-expect-error always added to metadata
        const { vendor, driver } = subscription.metadata;

        if (vendor) {
          await admin
            .firestore()
            .collection("Subscriptions")
            .doc(vendor)
            .set({ subscription });
          await admin
            .firestore()
            .collection("Vendors")
            .doc(vendor)
            .update({
              subscriptionStatus:
                subscription.status === "active" ||
                subscription.status === "trialing"
                  ? "active"
                  : "inactive",
            });
        } else if (driver) {
          await admin
            .firestore()
            .collection("Subscriptions")
            .doc(driver)
            .set({ subscription });
        }

        if (subscription.status === "canceled") {
          if (vendor) {
            const vendorDoc = await admin
              .firestore()
              .collection("Vendors")
              .doc(vendor)
              .get();
            const vendorEmail = (vendorDoc.data() as Vendor | undefined)?.email;
            if (vendorEmail) {
              await sendEmailNotification({
                title: "Subscription Canceled",
                body: "Your subscription has been canceled. To avoid loss of service and you can reactivate your subscription within the DelivFree app. If you need assistance please contact us at info@delivfree.com. Thank you.",
                to: [vendorEmail],
              });
            }
          } else if (driver) {
            const driverDoc = await admin
              .firestore()
              .collection("Drivers")
              .doc(driver)
              .get();
            const driverData = driverDoc.data() as Driver | undefined;

            if (driverData) {
              const vendorDoc = await admin
                .firestore()
                .collection("Vendors")
                .doc(driverData.vendors[0])
                .get();
              const vendorData = vendorDoc.data() as Vendor | undefined;

              if (driverData.email) {
                await sendEmailNotification({
                  title: "Subscription Canceled",
                  body: "Your subscription has been canceled. To avoid loss of service you can reactivate your subscription within the DelivFree app. If you need assistance please contact us at info@delivfree.com. Thank you.",
                  to: [driverData.email],
                });
              }

              if (vendorData?.email) {
                await sendEmailNotification({
                  title: "Driver Subscription Canceled",
                  body: "Your driver's subscription has been canceled. To continue to accept orders please coordinate with them to reactivate their subscription. If you need assistance please contact us at info@delivfree.com. Thank you.",
                  to: [vendorData.email],
                });
              }
            }
          }
        }

        // Then define and call a function to handle the event customer.subscription.created
        break;
      }
      case "invoice.created": {
        // const invoice = event.data.object;
        // const lineItem = invoice.lines.data[0];
        // const productId = lineItem.metadata.productId;

        // console.log('invoice created', productId);

        break;
      }
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.error("stripe webhook error", error);
    res.status(500).send();
  }
});

export const fetchSubscriptionPaymentSheet = onCall(
  async (
    data: CallableRequest<{
      customerData: {
        email: string;
        name: string;
        address: { country: string; postal_code: string };
      };
      params: Stripe.SubscriptionCreateParams;
    }>
  ) => {
    let customer;

    const stripe = getStripe();
    const { customerData, params } = data.data;

    const customers = await stripe.customers.list({
      limit: 1,
      email: customerData.email,
    });

    if (!customers.data[0]) {
      customer = await stripe.customers.create(customerData);
    } else {
      customer = customers.data[0];
    }

    // let pendingSubscription;

    // try {
    //   const subscriptions = await stripe.subscriptions.list({
    //     customer: customer.id,
    //     expand: ["data.latest_invoice", "data.latest_invoice.payment_intent"],
    //   });
    //   pendingSubscription =
    //     subscriptions.data &&
    //     subscriptions.data.find(
    //       (subscription: any) =>
    //         subscription.status === "incomplete" &&
    //         subscription.metadata &&
    //         subscription.items.data.length === prices.length &&
    //         params.items.every(({ id, quantity }) => {
    //           return subscription.items.data.find((item: any) => {
    //             return item.price.id === id && item.quantity === quantity;
    //           });
    //         })
    //     );
    // } catch (error) {
    //   console.log("Failed to check for pending subscription: ", error);
    // }

    const subscription = await stripe.subscriptions.create({
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      ...params,
      customer: customer.id,
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-04-10" }
    );

    return {
      // @ts-expect-error works
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customerId: customer.id,
    };
  }
);

export const fetchPaymentSheet = onCall(
  async (
    data: CallableRequest<{
      customerData: {
        email: string;
        name: string;
      };
      params: Stripe.PaymentIntentCreateParams;
    }>
  ) => {
    let customer: Stripe.Customer;

    const { customerData, params } = data.data;

    const stripe = getStripe();

    const customers = await stripe.customers.list({
      limit: 1,
      email: customerData.email,
    });

    if (!customers.data[0]) {
      customer = await stripe.customers.create(customerData);
    } else {
      customer = customers.data[0];
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-04-10" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      ...params,
      customer: customer.id,
    });

    return {
      ephemeralKey: ephemeralKey.secret,
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
    };
  }
);
