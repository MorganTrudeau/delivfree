import * as admin from "firebase-admin";
import { License, Positions } from "../types";
import { HttpsError } from "firebase-functions/v2/https";

export const checkAuthentication = (uid: string | undefined): void => {
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
};

export const getLicenseData = async (licenseId: string): Promise<License> => {
  const licenseRef = admin.firestore().collection("Licenses").doc(licenseId);
  const licenseDoc = await licenseRef.get();
  const license = licenseDoc.data() as License;
  if (!license) {
    throw new HttpsError("not-found", "License could not be found.");
  }
  return license;
};

export const getPositionsData = async (
  positionsId: string
): Promise<Positions> => {
  const positionsRef = admin
    .firestore()
    .collection("Positions")
    .doc(positionsId);
  const positionsDoc = await positionsRef.get();
  const positions = positionsDoc.data() as Positions;
  if (!positions) {
    throw new HttpsError("not-found", "Postions not available for license.");
  }
  return positions;
};

export const increaseLicensePositions = async (
  batch: admin.firestore.WriteBatch,
  license: License
) => {
  // Fetch positions
  const positionsId = license.position;
  const positionsRef = admin
    .firestore()
    .collection("Positions")
    .doc(positionsId);
  const positions = await getPositionsData(positionsId);

  // Update filled positions number
  // Check positions are available for this license
  const filledFullTime = Math.min(
    positions.maxFullTime,
    positions.filledFullTime + license.fullTimePositions
  );
  const filledPartTime = Math.min(
    positions.maxPartTime,
    positions.filledPartTime + license.partTimePositions
  );

  if (
    filledFullTime > positions.maxFullTime ||
    filledPartTime > positions.maxPartTime
  ) {
    throw new HttpsError(
      "out-of-range",
      "This location does not have available positions for this license."
    );
  }

  const availableFullTime = Math.max(0, positions.maxFullTime - filledFullTime);
  const availablePartTime = Math.max(0, positions.maxPartTime - filledPartTime);
  const hasOpenings =
    filledFullTime < positions.maxFullTime ||
    filledPartTime < positions.maxPartTime;

  const positionsUpdate: Partial<Positions> = {
    filledFullTime,
    filledPartTime,
    hasOpenings,
  };

  // Fetch other pending license applications for this position and decline them
  const positionLicenseDocs = await Promise.all(
    positions.licenses
      .filter((id) => id !== license.id)
      .map((id) => admin.firestore().collection("Licenses").doc(id).get())
  );
  const positionLicenses = positionLicenseDocs.map(
    (doc) => doc.data() as License
  );
  const licensesToDecline = positionLicenses.filter(
    (license) =>
      license.status === "pending" &&
      (license.fullTimePositions > availableFullTime ||
        license.partTimePositions > availablePartTime)
  );

  if (licensesToDecline) {
    await Promise.all(
      licensesToDecline.map((license) =>
        batch.update(admin.firestore().collection("Licenses").doc(license.id), {
          status: "declined",
          statusMessage: "Another license was accepted. Please apply again.",
        })
      )
    );
  }

  batch.update(positionsRef, positionsUpdate);
};

export const decreaseLicensePositionsBatch = async (
  batch: admin.firestore.WriteBatch,
  license: License
) => {
  const positionId = license.position;
  const positionsRef = admin
    .firestore()
    .collection("Positions")
    .doc(positionId);
  const positionsDoc = await positionsRef.get();
  const positions = positionsDoc.data() as Positions;

  if (!positions) {
    throw new HttpsError("not-found", "Positions not available for license.");
  }

  const filledFullTime = Math.max(
    0,
    positions.filledFullTime - license.fullTimePositions
  );
  const filledPartTime = Math.max(
    0,
    positions.filledPartTime - license.partTimePositions
  );
  const availableFullTime = Math.min(
    positions.maxFullTime,
    positions.maxFullTime + filledFullTime
  );
  const availablePartTime = Math.min(
    positions.maxPartTime,
    positions.maxPartTime + filledPartTime
  );
  const hasOpenings = !!availableFullTime || !!availablePartTime;

  const positionsUpdate: Partial<Positions> = {
    filledFullTime,
    filledPartTime,
    hasOpenings,
  };

  batch.update(positionsRef, positionsUpdate);
};
