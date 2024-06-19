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
import {
  Driver,
  License,
  Order,
  Positions,
  Vendor,
  VendorLocation,
} from "./types";
import {
  buildMessagePayload,
  sendAdminNotifications,
  sendNotifications,
} from "./utils/notifications";
import {
  CallableRequest,
  HttpsError,
  onCall,
  onRequest,
} from "firebase-functions/v2/https";
import {
  onDocumentCreated,
  onDocumentWritten,
} from "firebase-functions/v2/firestore";
import * as cors from "cors";
import {
  increaseLicensePositions,
  checkAuthentication,
  getLicenseData,
  decreaseLicensePositionsBatch,
} from "./utils";

const whitelistDomains = true; //[/delivfree-vendor\.web\.app$/, "*"];

admin.initializeApp();

const googlePlacesApi = express();

//Other stuff you are doing with express
googlePlacesApi.use(cors({ origin: "*" }));

const domain = "https://app.delivfree.com";
const adminDomain = "https://admin.delivfree.com";

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

export const mobileRedirect = onRequest(
  { cors: whitelistDomains },
  (req, res) => {
    res.redirect("delivfree://");
  }
);

export const isAdmin = onCall(
  async (
    request: CallableRequest<{
      email: string;
    }>
  ) => {
    const user = await admin.auth().getUserByEmail(request.data.email);
    if (!user) {
      return false;
    }
    const uid = user.uid;
    const adminUser = await admin
      .firestore()
      .collection("Admins")
      .doc(uid)
      .get();
    return !!adminUser.data();
  }
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

export const onOrderWritten = onDocumentWritten(
  "Orders/{orderId}",
  async (event) => {
    if (!event.data) {
      return true;
    }

    const orderBefore = event.data.before.data() as Order | undefined;
    const orderAfter = event.data.after.data() as Order | undefined;

    const vendor = orderBefore?.vendor || orderAfter?.vendor;
    const date = orderBefore?.date || orderAfter?.date;
    const customer = orderBefore?.customer || orderAfter?.customer;

    if (!orderBefore?.driver && orderAfter?.driver) {
      try {
        const userIds = [orderAfter.driver];
        const notification = {
          title: "New Order",
          body: `View order details and prepare for delivery.`,
        };
        const data = {
          orderId: orderAfter.id,
          type: "order_created",
        };
        const collapseKey = "orderCreated";
        const link = `https://${domain}?route=orders`;
        const payload = buildMessagePayload(
          notification,
          data,
          collapseKey,
          link
        );
        await sendNotifications(userIds, payload);
      } catch (error) {
        console.log("Failed to notify driver of new order", error);
      }
    }

    if (!(vendor && date && customer)) {
      return true;
    }

    var today = new Date(date);

    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var day = String(today.getDate()).padStart(2, "0");

    var formattedDate = year + "-" + month + "-" + day;

    const tip =
      (orderAfter?.tip ? Number(orderAfter.tip) : 0) -
      (orderBefore?.tip ? Number(orderBefore.tip) : 0);
    const amount =
      (orderAfter?.total ? Number(orderAfter.total) : 0) -
      (orderBefore?.total ? Number(orderBefore.total) : 0);

    const update: {
      count?: admin.firestore.FieldValue;
      tips: admin.firestore.FieldValue;
      amount: admin.firestore.FieldValue;
      customer: {
        [id: string]: {
          amount: admin.firestore.FieldValue;
          tips: admin.firestore.FieldValue;
        };
      };
    } = {
      amount: admin.firestore.FieldValue.increment(amount),
      tips: admin.firestore.FieldValue.increment(tip),
      customer: {
        [customer]: {
          amount: admin.firestore.FieldValue.increment(amount),
          tips: admin.firestore.FieldValue.increment(tip),
        },
      },
    };

    if (!orderBefore || !orderAfter) {
      update.count = admin.firestore.FieldValue.increment(
        !orderBefore ? 1 : -1
      );
    }

    await admin
      .firestore()
      .collection("VendorOrderCount")
      .doc(vendor)
      .collection("OrderCount")
      .doc(formattedDate)
      .set(update, { merge: true });

    return true;
  }
);

export const onVendorCreated = onDocumentCreated("Vendors/{id}", async () => {
  const notification = {
    title: "New Vendor",
    body: "Review the new vendor profile.",
  };
  const data = {
    type: "new_vendor",
  };
  const collapseKey = "new_vendor";
  const link = `https://${adminDomain}?route=vendors`;
  const payload = buildMessagePayload(notification, data, collapseKey, link);
  await sendAdminNotifications(payload);
});

export const onVendorLocationCreated = onDocumentCreated(
  "VendorLocations/{id}",
  async () => {
    const notification = {
      title: "New Vendor Location",
      body: "Review the new vendor location.",
    };
    const data = {
      type: "new_vendor_location",
    };
    const collapseKey = "new_vendor_location";
    const link = `https://${adminDomain}?route=vendors`;
    const payload = buildMessagePayload(notification, data, collapseKey, link);
    await sendAdminNotifications(payload);
  }
);

export const onPositionCreated = onDocumentCreated(
  "Positions/{id}",
  async () => {
    const notification = {
      title: "New Position Posted",
      body: "Review the new position.",
    };
    const data = {
      type: "new_position",
    };
    const collapseKey = "new_position";
    const link = `https://${adminDomain}?route=vendors`;
    const payload = buildMessagePayload(notification, data, collapseKey, link);
    await sendAdminNotifications(payload);
  }
);

export const onLicenseCreated = onDocumentCreated("Licenses/{id}", async () => {
  const notification = {
    title: "New License Application",
    body: "Review the new license application.",
  };
  const data = {
    type: "new_application",
  };
  const collapseKey = "new_application";
  const link = `https://${adminDomain}?route=vendors`;
  const payload = buildMessagePayload(notification, data, collapseKey, link);
  await sendAdminNotifications(payload);
});

export const onVendorLocationWritten = onDocumentWritten(
  "VendorLocations/{id}",
  async (event) => {
    if (!event.data) {
      return true;
    }
    const locationBefore = event.data.before.data() as
      | VendorLocation
      | undefined;
    const locationAfter = event.data.after.data() as VendorLocation | undefined;

    const id = locationBefore?.id || locationAfter?.id;
    const vendor = locationBefore?.vendor || locationAfter?.vendor;

    if (!vendor) {
      return true;
    }

    const statusBefore = locationBefore?.status;
    const statusAfter = locationAfter?.status;

    if (statusBefore !== statusAfter) {
      const update: {
        [Property in keyof Pick<
          Vendor,
          "pendingLocations"
        >]?: admin.firestore.FieldValue;
      } & Pick<Vendor, "updated"> = {
        updated: Date.now(),
        pendingLocations:
          statusAfter === "pending"
            ? admin.firestore.FieldValue.arrayUnion(id)
            : admin.firestore.FieldValue.arrayRemove(id),
      };
      await admin.firestore().collection("Vendors").doc(vendor).update(update);
    }

    return true;
  }
);

export const onPositionsWritten = onDocumentWritten(
  "Positions/{id}",
  async (event) => {
    if (!event.data) {
      return true;
    }
    const positionsBefore = event.data.before.data() as Positions | undefined;
    const positionsAfter = event.data.after.data() as Positions | undefined;

    const id = positionsBefore?.id || positionsAfter?.id;
    const vendor = positionsBefore?.vendor || positionsAfter?.vendor;

    if (!vendor) {
      return true;
    }

    const statusBefore = positionsBefore?.status;
    const statusAfter = positionsAfter?.status;

    if (statusBefore !== statusAfter) {
      const update: {
        [Property in keyof Pick<
          Vendor,
          "pendingPositions"
        >]?: admin.firestore.FieldValue;
      } & Pick<Vendor, "updated"> = {
        updated: Date.now(),
        pendingPositions:
          statusAfter === "pending"
            ? admin.firestore.FieldValue.arrayUnion(id)
            : admin.firestore.FieldValue.arrayRemove(id),
      };
      await admin.firestore().collection("Vendors").doc(vendor).update(update);
    }

    return true;
  }
);

export const onLicensesWritten = onDocumentWritten(
  "Licenses/{id}",
  async (event) => {
    if (!event.data) {
      return true;
    }
    const licenseBefore = event.data.before.data() as License | undefined;
    const licenseAfter = event.data.after.data() as License | undefined;

    const id = licenseBefore?.id || licenseAfter?.id;
    const driver = licenseBefore?.driver || licenseAfter?.driver;
    const vendor = licenseBefore?.vendor || licenseAfter?.vendor;
    const vendorLocation =
      licenseBefore?.vendorLocation || licenseAfter?.vendorLocation;

    if (!driver) {
      return true;
    }

    const statusBefore = licenseBefore?.status;
    const statusAfter = licenseAfter?.status;

    if (statusBefore !== statusAfter) {
      const update: {
        [Property in keyof Pick<
          Driver,
          "pendingLicenses" | "vendors" | "vendorLocations"
        >]?: admin.firestore.FieldValue;
      } & Pick<Driver, "updated"> = {
        updated: Date.now(),
        vendors:
          statusAfter === "approved"
            ? admin.firestore.FieldValue.arrayUnion(vendor)
            : admin.firestore.FieldValue.arrayRemove(vendor),
        vendorLocations:
          statusAfter === "approved"
            ? admin.firestore.FieldValue.arrayUnion(vendorLocation)
            : admin.firestore.FieldValue.arrayRemove(vendorLocation),
        pendingLicenses:
          statusAfter === "pending"
            ? admin.firestore.FieldValue.arrayUnion(id)
            : admin.firestore.FieldValue.arrayRemove(id),
      };
      await admin.firestore().collection("Drivers").doc(driver).update(update);
    }

    return true;
  }
);

export const approveLicense = onCall({}, async (request) => {
  checkAuthentication(request.auth?.uid);

  // Fetch license
  const { license: licenseId } = request.data;
  const licenseRef = admin.firestore().collection("Licenses").doc(licenseId);
  const license = await getLicenseData(licenseId);
  const licenseUpdate: Partial<License> = {
    status: "approved",
    statusMessage: null,
  };

  const batch = admin.firestore().batch();
  await increaseLicensePositions(batch, license);
  batch.update(licenseRef, licenseUpdate);
  return await batch.commit();
});

export const denyLicense = onCall({}, async (request) => {
  checkAuthentication(request.auth?.uid);

  const { license: licenseId, message = null } = request.data;
  const license = await getLicenseData(licenseId);

  const licenseUpdate: Partial<License> = {
    status: "denied",
    statusMessage: message,
  };

  const batch = admin.firestore().batch();

  if (license.status === "approved") {
    await decreaseLicensePositionsBatch(batch, license);
  }

  batch.update(
    admin.firestore().collection("Licenses").doc(licenseId),
    licenseUpdate
  );

  return await batch.commit();
});

export const deleteLicense = onCall({}, async (request) => {
  checkAuthentication(request.auth?.uid);

  const { license: licenseId } = request.data;
  const license = await getLicenseData(licenseId);

  const batch = admin.firestore().batch();

  if (license.status === "approved") {
    await decreaseLicensePositionsBatch(batch, license);
  }

  batch.update(admin.firestore().collection("Drivers").doc(license.driver), {
    updated: Date.now(),
    licenses: admin.firestore.FieldValue.arrayRemove(license.id),
  });
  batch.update(
    admin.firestore().collection("Positions").doc(license.position),
    {
      updated: Date.now(),
      licenses: admin.firestore.FieldValue.arrayRemove(license.id),
    }
  );
  batch.delete(admin.firestore().collection("Licenses").doc(licenseId));

  return await batch.commit();
});

export const createLicense = onCall({}, async (request) => {
  checkAuthentication(request.auth?.uid);

  const { license } = request.data;
  const batch = admin.firestore().batch();

  batch.set(admin.firestore().collection("Licenses").doc(license.id), license);
  batch.update(admin.firestore().collection("Drivers").doc(license.driver), {
    updated: Date.now(),
    licenses: admin.firestore.FieldValue.arrayUnion(license.id),
  });
  batch.update(
    admin.firestore().collection("Positions").doc(license.position),
    {
      updated: Date.now(),
      licenses: admin.firestore.FieldValue.arrayUnion(license.id),
    }
  );

  return await batch.commit();
});

export * from "./apis/stripe";
