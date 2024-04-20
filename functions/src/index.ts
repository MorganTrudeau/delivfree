/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import axios from "axios";
import { Driver } from "./types";

admin.initializeApp();

const googlePlacesApi = express();

console.log("HI");

googlePlacesApi.get("*", async (req, res) => {
  console.log(req.path, req.query);
  const data = await axios.get(
    `https://maps.googleapis.com/maps/api${req.path}`,
    {
      params: req.query,
    }
  );
  res.json(data.data);
});

export const googlePlaces = functions.https.onRequest(googlePlacesApi);

// export const googlePlacesApi = onRequest(async (req, res) => {
//   console.log(req.query);
//   console.log(req.body);
//   const data = await fetch("https://maps.googleapis.com/maps/api");
//   res.json(data);
// });

export const addDriver = functions.https.onCall(
  async (data: { driver: string; vendor: string; parentDriver: string }) => {
    if (!(data.driver && data.vendor)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required data"
      );
    }

    const driverRef = admin.firestore().collection("Drivers").doc(data.driver);
    const driverDoc = await driverRef.get();
    const driver = driverDoc.data() as Driver | null;

    if (!driver) {
      throw new functions.https.HttpsError("not-found", "Driver not found");
    }

    const updatedDriver: Driver = {
      ...driver,
      vendors: [...(driver.vendors || []), data.vendor],
    };

    if (data.parentDriver) {
      updatedDriver.parentDrivers = { [data.vendor]: data.parentDriver };
    }

    driverRef.set(updatedDriver);

    return true;
  }
);

export * from "./apis/stripe";
