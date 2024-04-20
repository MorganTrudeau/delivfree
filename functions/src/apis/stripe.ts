import { defineString } from "firebase-functions/params";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

const apiKey = defineString("STRIPE_SECRET_KEY");
const signingSecret = defineString("STRIPE_SIGNING_SECRET");

let _stripe: Stripe;
const getStripe = () => {
  console.log("API KEY", apiKey.value());
  if (!_stripe) {
    _stripe = new Stripe(apiKey.value());
  }
  return _stripe;
};

export const createSubscription = functions.https.onCall(
  async (data: { params: Stripe.SubscriptionCreateParams }) => {
    return await getStripe().subscriptions.create(data.params);
  }
);

export const updateSubscription = functions.https.onCall(
  async (data: { id: string; params: Stripe.SubscriptionUpdateParams }) => {
    return await getStripe().subscriptions.update(data.id, data.params);
  }
);

export const fetchSubscriptions = functions.https.onCall(
  async (data: { params: Stripe.SubscriptionListParams }) => {
    return await getStripe().subscriptions.list(data.params);
  }
);

export const fetchProducts = functions.https.onCall(
  async (data: { params: Stripe.ProductListParams }) => {
    return await getStripe().products.list(data.params);
  }
);

export const createCheckoutSession = functions.https.onCall(
  async (data: { params: Stripe.Checkout.SessionCreateParams }) => {
    return await getStripe().checkout.sessions.create(data.params);
  }
);

export const loadCheckoutSession = functions.https.onCall(
  async (data: { id: string }) => {
    return await getStripe().checkout.sessions.retrieve(data.id);
  }
);

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
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
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const { vendor, driver } = subscription.metadata;

        if (vendor) {
          await admin
            .firestore()
            .collection("Subscriptions")
            .doc(vendor)
            .set({ subscription });
        } else if (driver) {
          await admin
            .firestore()
            .collection("Subscriptions")
            .doc(driver)
            .set({ subscription });
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
