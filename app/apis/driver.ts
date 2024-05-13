import { Driver } from "delivfree";
import firestore from "@react-native-firebase/firestore";

export const updateDriver = (driverId: string, update: Partial<Driver>) => {
  return firestore().collection("Drivers").doc(driverId).update(update);
};
