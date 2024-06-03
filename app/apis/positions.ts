import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Positions, Status } from "delivfree";
import * as geofire from "geofire-common";

export const addPositions = (positions: Positions) => {
  return firestore().collection("Positions").doc(positions.id).set(positions);
};

export const updatePositions = (
  positionsId: string,
  update: Partial<Positions>
) => {
  return firestore().collection("Positions").doc(positionsId).update(update);
};

const buildPositionsQuery = (
  params: {
    vendor?: string;
    vendorLocation?: string;
    limit?: number;
    status?: Status;
    hasOpenings?: boolean;
    longitude?: number;
    latitude?: number;
  } = {}
) => {
  const { vendor, vendorLocation, limit, status, hasOpenings } = params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("Positions");

  if (limit) {
    query = query.limit(limit);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  if (vendorLocation) {
    query = query.where("vendorLocation", "==", vendorLocation);
  }

  if (status) {
    query = query.where("status", "==", status);
  }

  if (hasOpenings) {
    query = query.where("hasOpenings", "==", hasOpenings);
  }

  return query;
};

export const fetchPositions = async (
  params: {
    vendor?: string;
    vendorLocation?: string;
    limit?: number;
    status?: Status;
    hasOpenings?: boolean;
    longitude?: number;
    latitude?: number;
  } = {}
): Promise<Positions[]> => {
  const { latitude, longitude } = params;

  let query = buildPositionsQuery(params);

  if (latitude && longitude) {
    const center: [number, number] = [latitude, longitude];
    const radiusInM = 50 * 1000;
    const bounds = geofire.geohashQueryBounds(center, radiusInM);

    const positions: Positions[] = [];

    for (const b of bounds) {
      const locationQuery = query.orderBy("geohash").startAt(b[0]).endAt(b[1]);

      const promises: Promise<any>[] = [];

      promises.push(locationQuery.get());

      const snapshots = await Promise.all(promises);

      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get("latitude") as number;
          const lng = doc.get("longitude") as number;

          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            positions.push(doc.data() as Positions);
          }
        }
      }
    }

    return positions;
  }

  const snap = await query.get();
  const positions = snap.docs.map((doc) => doc.data() as Positions);

  return positions;
};

export const listenToPositions = (
  onData: (positions: { [id: string]: Positions }) => void,
  params: {
    vendor?: string;
    vendorLocation?: string;
    limit?: number;
    status?: Status;
    hasOpenings?: boolean;
  } = {}
) => {
  const { vendor, vendorLocation, limit, status, hasOpenings } = params;
  params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("Positions");

  if (limit) {
    query = query.limit(limit);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  if (vendorLocation) {
    query = query.where("vendorLocation", "==", vendorLocation);
  }

  if (status) {
    query = query.where("status", "==", status);
  }

  if (hasOpenings) {
    query = query.where("hasOpenings", "==", hasOpenings);
  }

  return query.onSnapshot((snap) => {
    const positions = snap
      ? snap.docs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.data() }), {})
      : {};
    onData(positions);
  });
};
