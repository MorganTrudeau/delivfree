import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Customer } from "delivfree";
import { equalStringOrInArray } from "./utils";

export const listenToCustomers = (
  onData: (customers: { [id: string]: Customer }) => void,
  params: {
    vendor?: string | string[];
    vendorLocation?: string | string[];
  } = {}
) => {
  const { vendor, vendorLocation } = params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("Customers");

  if (vendor) {
    query = query.where("vendor", equalStringOrInArray(vendor), vendor);
  }

  if (vendorLocation) {
    query = query.where(
      "vendor",
      equalStringOrInArray(vendorLocation),
      vendorLocation
    );
  }

  return query.onSnapshot((snap) => {
    const customers = snap
      ? snap.docs.reduce(
          (acc, doc) => ({ ...acc, [doc.id]: doc.data() as Customer }),
          {} as { [id: string]: Customer }
        )
      : {};
    onData(customers);
  });
};
