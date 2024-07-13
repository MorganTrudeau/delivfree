import {
  Cuisine,
  DriverClockIn,
  LatLng,
  Menu,
  Positions,
  VendorLocation,
} from "delivfree";
import * as geofire from "geofire-common";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { equalStringOrInArray } from "./utils";
import { getMenuNextOpen, hasActiveMenu } from "app/utils/menus";

export const deleteVendorLocation = async (vendorLocation: string) => {
  const batch = firestore().batch();

  const vendorLocationDoc = firestore()
    .collection("VendorLocations")
    .doc(vendorLocation);
  const positionsSnap = await firestore()
    .collection("Positions")
    .where("vendorLocation", "==", vendorLocation)
    .get();
  const licensesSnap = await firestore()
    .collection("Licenses")
    .where("vendorLocation", "==", vendorLocation)
    .get();

  positionsSnap.docs.forEach((doc) => batch.delete(doc.ref));
  licensesSnap.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(vendorLocationDoc);

  return batch.commit();
};

export const updateVendorLocation = (
  vendorLocation: string,
  update: Partial<VendorLocation>
) => {
  return firestore()
    .collection("VendorLocations")
    .doc(vendorLocation)
    .update(update);
};

export const addVendorLocation = (
  vendorLocation: VendorLocation,
  positions: Positions
) => {
  const batch = firestore().batch();
  batch.set(
    firestore().collection("VendorLocations").doc(vendorLocation.id),
    vendorLocation
  );
  batch.set(firestore().collection("Positions").doc(positions.id), positions);
  return batch.commit();
};

export const fetchVendorLocation = async (id: string) => {
  const doc = await firestore().collection("VendorLocations").doc(id).get();
  return doc.data() as VendorLocation | undefined;
};

export const fetchVendorLocationDetail = async (id: string) => {
  const doc = await firestore().collection("VendorLocations").doc(id).get();
  const vendorLocation = doc.data() as VendorLocation | undefined;
  if (!vendorLocation) {
    return undefined;
  }
  return loadVendorLocationDetails(vendorLocation);
};

export const listenToVendorLocations = (
  onData: (vendorLocations: { [id: string]: VendorLocation }) => void,
  params: {
    id?: string | string[];
    vendor?: string | string[];
  } = {}
) => {
  const { id, vendor } = params;

  let query: FirebaseFirestoreTypes.Query =
    firestore().collection("VendorLocations");

  if (id) {
    query = query.where("id", equalStringOrInArray(id), id);
  }

  if (vendor) {
    query = query.where("vendor", equalStringOrInArray(vendor), vendor);
  }

  return query.onSnapshot((snap) => {
    const vendorLocations = snap
      ? snap.docs.reduce(
          (acc, doc) => ({ ...acc, [doc.id]: doc.data() as VendorLocation }),
          {}
        )
      : {};
    onData(vendorLocations);
  });
};

export const fetchVendorLocations = async (
  centerLatLng: LatLng,
  queryOptions: { cuisine?: Cuisine; limit?: number; keyword?: string } = {},
  radiusKm = 10
): Promise<VendorLocation[]> => {
  const { cuisine, limit, keyword } = queryOptions;

  const center: [number, number] = [
    centerLatLng.latitude,
    centerLatLng.longitude,
  ];
  const radiusInM = radiusKm * 1000;

  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
  const bounds = geofire.geohashQueryBounds(center, radiusInM);
  const promises: Promise<
    FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
  >[] = [];
  for (const b of bounds) {
    let q = firestore()
      .collection("VendorLocations")
      .orderBy("geohash")
      .where("status", "==", "approved")
      .startAt(b[0])
      .endAt(b[1]);
    if (cuisine) {
      q = q.where("cuisines", "array-contains", cuisine);
    }
    if (limit) {
      q = q.limit(limit);
    }
    if (keyword) {
      q = q.where("keywords", "array-contains", keyword.toLowerCase());
    }
    promises.push(q.get());
  }

  const snapshots = await Promise.all(promises);

  const vendorLocations: VendorLocation[] = [];

  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const lat = doc.get("latitude") as number;
      const lng = doc.get("longitude") as number;

      // We have to filter out a few false positives due to GeoHash
      // accuracy, but most will match
      const distanceInKm = geofire.distanceBetween([lat, lng], center);
      const distanceInM = distanceInKm * 1000;
      if (distanceInM <= radiusInM) {
        vendorLocations.push(doc.data() as VendorLocation);
      }
    }
  }

  const vendorLocationDetails = await Promise.all(
    vendorLocations.map((vendorLocation) =>
      loadVendorLocationDetails(vendorLocation)
    )
  );

  return vendorLocationDetails
    .filter((v) => v)
    .sort((a, b) => {
      const vendorLocationA = a as VendorLocation;
      const vendorLocationB = b as VendorLocation;

      if (vendorLocationA.isOpen && !vendorLocationB.isOpen) {
        return -1;
      }
      if (vendorLocationB.isOpen && !vendorLocationA.isOpen) {
        return 1;
      }

      return 1;
    }) as VendorLocation[];
};

const loadVendorLocationDetails = async (
  vendorLocation: VendorLocation
): Promise<VendorLocation | null> => {
  const vendorDoc = await firestore()
    .collection("Vendors")
    .doc(vendorLocation.vendor)
    .get();
  const menusSnap = await firestore()
    .collection("Menus")
    .where("vendor", "==", vendorLocation.vendor)
    .get();
  const activeDriversSnap = await firestore()
    .collection("DriverClockIns")
    .where("vendorLocation", "==", vendorLocation.id)
    .get();

  const vendor = vendorDoc.data();
  const menus = menusSnap.docs.map((doc) => doc.data() as Menu);
  const activeDrivers = activeDriversSnap.docs.map(
    (doc) => doc.data() as DriverClockIn
  );

  if (
    !(
      vendor &&
      vendor.registration.status === "approved" &&
      vendor.subscriptionStatus === "active" &&
      vendor.stripe.accountId &&
      vendor.stripe.detailsSubmitted &&
      vendor.stripe.payoutsEnabled &&
      menus?.length
    )
  ) {
    return null;
  }

  const menusActive = hasActiveMenu(menus);
  return {
    ...vendorLocation,
    isOpen: !!menusActive && !!activeDrivers?.length,
    nextOpen: !menusActive ? getMenuNextOpen(menus) : "",
  };
};
