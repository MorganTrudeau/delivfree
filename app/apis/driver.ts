import { Driver, Status } from "delivfree";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { equalStringOrInArray } from "./utils";

export const createDriver = (driver: Driver) => {
  return firestore().collection("Drivers").doc(driver.id).set(driver);
};

export const updateDriver = (driverId: string, update: Partial<Driver>) => {
  return firestore().collection("Drivers").doc(driverId).update(update);
};

export const fetchDriver = async (driver: string) => {
  const doc = await firestore().collection("Drivers").doc(driver).get();
  return doc.data() as Driver | undefined;
};

export const deleteDriver = async (
  driver: string,
  batchArg?: FirebaseFirestoreTypes.WriteBatch
) => {
  const batch = batchArg || firestore().batch();

  const licensesSnap = await firestore()
    .collection("Licenses")
    .where("driver", "==", driver)
    .get();

  licensesSnap.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(firestore().collection("Drivers").doc(driver));

  if (!batchArg) {
    return batch.commit();
  }
};

export const fetchDrivers = async (params: { vendorLocations: string[] }) => {
  const snap = await firestore()
    .collection("Drivers")
    .where("vendorLocations", "array-contains-any", params.vendorLocations)
    .get();
  return snap ? snap.docs.map((doc) => doc.data() as Driver) : [];
};

export const listenToDriver = (
  driver: string,
  onData: (driver: Driver | null) => void
) => {
  return firestore()
    .collection("Drivers")
    .doc(driver)
    .onSnapshot(
      (doc) => onData((doc?.data() || null) as Driver | null),
      (error) => {
        console.log("Failed to load driver", error);
      }
    );
};

export type DriversListenerParams = {
  limit?: number;
  status?: Status;
  id?: string | string[];
};
export const listenToDrivers = (
  onData: (drivers: { [id: string]: Driver }) => void,
  params: DriversListenerParams = {}
) => {
  let query: FirebaseFirestoreTypes.Query = firestore()
    .collection("Drivers")
    .orderBy("updated", "desc");

  if (params.status) {
    query = query.where("registration.status", "==", params.status);
  }
  if (params.id) {
    query = query.where("id", equalStringOrInArray(params.id), params.id);
  }
  if (params.limit) {
    query = query.limit(params.limit);
  }

  return query.onSnapshot((snap) => {
    const drivers = snap
      ? snap.docs.reduce(
          (acc, doc) => ({ ...acc, [doc.id]: doc.data() as Driver }),
          {} as { [id: string]: Driver }
        )
      : {};
    onData(drivers);
  });
};
