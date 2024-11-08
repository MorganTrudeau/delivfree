import { firestore, auth } from "firebase-admin";
import {
  CallableRequest,
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";
import { User } from "../types";

export const deleteAccount = onCall(async (data: CallableRequest<{}>) => {
  const uid = data.auth?.uid;

  if (!uid) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to delete your account."
    );
  }

  const userDoc = await firestore().collection("Users").doc(uid).get();
  const user = userDoc.data() as User | undefined;

  if (!user) {
    throw new HttpsError("not-found", "User not found");
  }

  const batch = firestore().batch();

  if (user.vendor && user.vendor.ids[0]) {
    const vendorId = user.vendor.ids[0];
    // Delete vendor
    batch.delete(firestore().collection("Vendors").doc(vendorId));
    // Delete vendor locations
    const vendorLocationsCollection = firestore().collection("VendorLocations");
    const vendorLocations = await vendorLocationsCollection
      .where("vendor", "==", vendorId)
      .get();
    vendorLocations.docs.map((v) =>
      batch.delete(vendorLocationsCollection.doc(v.id))
    );
    // Delete positions
    const positionsCollection = firestore().collection("Positions");
    const positions = await positionsCollection
      .where("vendor", "==", vendorId)
      .get();
    positions.docs.map((p) => batch.delete(positionsCollection.doc(p.id)));
    // Delete licenses
    const licensesCollection = firestore().collection("Licenses");
    const licences = await licensesCollection
      .where("vendor", "==", vendorId)
      .get();
    licences.docs.map((l) => batch.delete(licensesCollection.doc(l.id)));
  }

  if (user.driver && user.driver.id) {
    batch.delete(firestore().collection("Drivers").doc(user.driver.id));
    const licensesCollection = firestore().collection("Licenses");
    const licences = await licensesCollection
      .where("driver", "==", user.driver.id)
      .get();
    licences.docs.map((l) => batch.delete(licensesCollection.doc(l.id)));
  }

  batch.delete(firestore().collection("Users").doc(uid));

  await batch.commit();

  await auth().deleteUser(uid);
});
