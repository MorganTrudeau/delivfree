import firestore from "@react-native-firebase/firestore";
import { DriverAvailability } from "delivfree";

export const listenToDriverAvailability = (
  driver: string,
  onData: (driverAvailability: DriverAvailability[]) => void
) => {
  return firestore()
    .collection("DriverAvailability")
    .where("driver", "==", driver)
    .onSnapshot((snap) => {
      const driverAvailability = snap
        ? snap.docs.map((doc) => doc.data() as DriverAvailability)
        : [];
      onData(driverAvailability);
    });
};

export const changeDriverAvailability = async (
  driver: string,
  vendorLocations: string[]
): Promise<DriverAvailability[]> => {
  const driverAvailabilityCollection =
    firestore().collection("DriverAvailability");

  const currentAvailablitySnap = await driverAvailabilityCollection
    .where("driver", "==", driver)
    .get();

  const batch = firestore().batch();

  currentAvailablitySnap.docs.forEach((doc) => {
    batch.delete(driverAvailabilityCollection.doc(doc.id));
  });

  const driverAvailability: DriverAvailability[] = vendorLocations.map(
    (vendorLocation) => {
      const driverAvailability: DriverAvailability = {
        vendorLocation,
        driver,
        date: Date.now(),
        ordersTaken: 0,
      };
      return driverAvailability;
    }
  );

  driverAvailability.forEach((data) => {
    batch.set(driverAvailabilityCollection.doc(), data);
  });

  await batch.commit();

  return driverAvailability;
};
