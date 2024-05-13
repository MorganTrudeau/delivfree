import firestore from "@react-native-firebase/firestore";
import { Customer } from "delivfree";

export const listenToCustomers = (
  vendor: string,
  onData: (customers: { [id: string]: Customer }) => void
) => {
  return firestore()
    .collection("Customers")
    .where("vendor", "==", vendor)
    .onSnapshot((snap) => {
      const customers = snap.docs.reduce(
        (acc, doc) => ({ ...acc, [doc.id]: doc.data() as Customer }),
        {} as { [id: string]: Customer }
      );
      onData(customers);
    });
};
