/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import * as express from "express";
import axios from "axios";
import { Driver, Order } from "./types";
import { buildMessagePayload, sendNotifications } from "./utils/notifications";
import {
  CallableRequest,
  HttpsError,
  onCall,
  onRequest,
} from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as cors from "cors";

const whitelistDomains = [/delivfree-vendor\.web\.app$/];

admin.initializeApp();

const googlePlacesApi = express();

//Other stuff you are doing with express
googlePlacesApi.use(cors({ origin: whitelistDomains }));

const domain = "https://app.delivfree.com";

googlePlacesApi.get("*", async (req, res) => {
  console.log(req.path, req.query);
  try {
    const data = await axios.get(
      `https://maps.googleapis.com/maps/api${req.path}`,
      {
        params: req.query,
      }
    );
    console.log(data);
    res.json(data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export const googlePlaces = onRequest(
  { cors: whitelistDomains },
  googlePlacesApi
);

export const addDriver = onCall(
  async (
    request: CallableRequest<{
      driver: string;
      vendor: string;
      parentDriver: string;
    }>
  ) => {
    const { driver: driverId, vendor, parentDriver } = request.data;
    if (!(driverId && vendor)) {
      throw new HttpsError("invalid-argument", "Missing required data");
    }

    const driverRef = admin.firestore().collection("Drivers").doc(driverId);
    const driverDoc = await driverRef.get();
    const driver = driverDoc.data() as Driver | null;

    if (!driver) {
      throw new HttpsError("not-found", "Driver not found");
    }

    const updatedDriver: Driver = {
      ...driver,
      vendors: [...(driver.vendors || []), vendor],
    };

    if (parentDriver) {
      updatedDriver.parentDrivers = { [vendor]: parentDriver };
    }

    driverRef.set(updatedDriver);

    return true;
  }
);

export const onOrderCreated = onDocumentCreated(
  "Orders/{orderId}",
  async (event) => {
    if (!event.data) {
      return true;
    }
    const order = event.data.data() as Order;
    const driverSnap = await admin
      .firestore()
      .collection("Drivers")
      .where("vendors", "array-contains", order.vendor)
      .get();
    const userIds = driverSnap.docs.map((doc) => (doc.data() as Driver).user);
    const notification = {
      title: "New Order",
      body: `View and claim the order.`,
    };
    const data = {
      orderId: order.id,
      type: "order_created",
    };
    const collapseKey = "orderCreated";
    const link = `https://${domain}?route=orders`;
    const payload = buildMessagePayload(notification, data, collapseKey, link);
    return sendNotifications(userIds, payload);
  }
);

export * from "./apis/stripe";
