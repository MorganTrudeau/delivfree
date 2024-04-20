import firestore from "@react-native-firebase/firestore";
import { Vendor } from "functions/src/types";

export const updateVendor = (id: string, update: Partial<Vendor>) => {
  return firestore().collection("Vendors").doc(id).update(update);
};
