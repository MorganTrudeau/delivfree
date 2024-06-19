import {
  Cuisine,
  LatLng,
  Menu,
  Positions,
  Vendor,
  VendorLocation,
} from "delivfree";
import * as geofire from "geofire-common";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { equalStringOrInArray } from "./utils";
import { getMenuNextOpen, hasActiveMenu } from "app/utils/menus";

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
) => {
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

  const vendorLocationIds = vendorLocations.map((v) => v.id);
  const vendorIds = vendorLocations.map((v) => v.vendor);

  const [vendorDocs, menuSnaps, activeDriverSnaps] = await Promise.all([
    Promise.all(
      vendorIds.map((id) => firestore().collection("Vendors").doc(id).get())
    ),
    Promise.all(
      vendorIds.map((id) =>
        firestore().collection("Menus").where("vendor", "==", id).get()
      )
    ),
    Promise.all(
      vendorLocationIds.map((id) =>
        firestore()
          .collection("DriverClockIns")
          .where("vendorLocation", "==", id)
          .get()
      )
    ),
  ]);

  const vendors = vendorDocs.reduce((acc, doc) => {
    const vendor = doc.data() as Vendor;
    return { ...acc, [vendor.id]: vendor };
  }, {} as { [vendor: string]: Vendor });
  const menus = menuSnaps.reduce((acc, menuSnap) => {
    const menus = menuSnap.docs.map((doc) => doc.data() as Menu);
    if (!menus[0]?.vendor) {
      return acc;
    }
    const vendor = menus[0].vendor;
    return { ...acc, [vendor]: menus };
  }, {} as { [vendor: string]: Menu[] });
  const activeDrivers = activeDriverSnaps.reduce((acc, driverSnap) => {
    const drivers = driverSnap.docs.map(
      (doc) => doc.data() as { vendorLocation: string; date: number }
    );
    const vendorLocation = drivers[0]?.vendorLocation;
    if (!vendorLocation) {
      return acc;
    }
    return { ...acc, [vendorLocation]: drivers };
  }, {} as { [vendor: string]: { vendorLocation: string; date: number }[] });

  return vendorLocations
    .filter((location) => {
      const vendor = vendors[location.vendor];
      const locationMenus = menus[location.vendor];
      const locationDrivers = activeDrivers[location.id];
      return (
        vendor &&
        vendor.registration.status === "approved" &&
        vendor.stripe.accountId &&
        vendor.stripe.detailsSubmitted &&
        vendor.stripe.payoutsEnabled &&
        locationMenus?.length &&
        locationDrivers?.length
      );
    })
    .map((location) => {
      const locationMenus = menus[location.vendor];
      const menusActive = hasActiveMenu(locationMenus);
      return {
        ...location,
        menusActive,
        nextOpen: !menusActive ? getMenuNextOpen(locationMenus) : "",
      };
    })
    .sort((a, b) => {
      if (a.menusActive && !b.menusActive) {
        return -1;
      }
      if (b.menusActive && !a.menusActive) {
        return 1;
      }
      return 1;
    });
};
