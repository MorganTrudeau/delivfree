import firestore from "@react-native-firebase/firestore";
import { Vendor } from "delivfree";

export const updateVendor = (id: string, update: Partial<Vendor>) => {
  return firestore().collection("Vendors").doc(id).update(update);
};
