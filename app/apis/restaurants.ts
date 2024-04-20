import { Cuisine, LatLng, RestaurantLocation } from "delivfree";
import * as geofire from "geofire-common";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { generateUid } from "app/utils/general";

const testData = [
  {
    locations: [
      {
        id: generateUid(),
        longitude: -122.66396940219714,
        latitude: 49.167837600169285,
      },
    ],
    name: "Pizza Hut",
  },
  {
    locations: [
      {
        id: generateUid(),
        longitude: -122.65882973466185,
        latitude: 49.163912272918175,
      },
    ],
    name: "Dominos",
  },
];

export const commitTestRestaurants = async () => {
  const restaurantsRef = firestore().collection("Restaurants");
  const restaurantLocationsRef = firestore().collection("RestaurantLocations");
  await Promise.all(
    testData.map(async (data) => {
      const id = firestore().collection("Restaurants").doc().id;
      const locationsData = data.locations.map((location) => {
        const geohash = geofire.geohashForLocation([
          location.latitude,
          location.longitude,
        ]);
        return { ...location, restaurantId: id, geohash };
      });
      await restaurantsRef.doc(id).set(data);
      await Promise.all(
        locationsData.map((location) => {
          return restaurantLocationsRef.doc(location.id).set(location);
        })
      );
    })
  );
};

export const addRestaurantLocation = (
  restaurantLocation: RestaurantLocation
) => {
  return firestore()
    .collection("RestaurantLocations")
    .doc(restaurantLocation.id)
    .set(restaurantLocation);
};

export const fetchRestaurants = async (
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
      .collection("RestaurantLocations")
      .orderBy("geohash")
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

  const restaurantLocations: RestaurantLocation[] = [];

  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const lat = doc.get("latitude") as number;
      const lng = doc.get("longitude") as number;

      // We have to filter out a few false positives due to GeoHash
      // accuracy, but most will match
      const distanceInKm = geofire.distanceBetween([lat, lng], center);
      const distanceInM = distanceInKm * 1000;
      if (distanceInM <= radiusInM) {
        restaurantLocations.push(doc.data() as RestaurantLocation);
      }
    }
  }

  return restaurantLocations;
};
