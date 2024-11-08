import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Status, Vendor } from "delivfree";
import { deleteVendorLocation } from "./vendorLocations";

export const updateVendor = (id: string, update: Partial<Vendor>) => {
  return firestore().collection("Vendors").doc(id).update(update);
};

export const listenToVendor = (
  vendor: string,
  onData: (vendor: Vendor | undefined) => void
) => {
  return firestore()
    .collection("Vendors")
    .doc(vendor)
    .onSnapshot((doc) => onData(doc?.data() as Vendor | undefined));
};

export const fetchVendor = async (vendor: string) => {
  const doc = await firestore().collection("Vendors").doc(vendor).get();
  return doc.data() as Vendor | undefined;
};

export const deleteVendor = async (
  vendor: string,
  batchArg?: FirebaseFirestoreTypes.WriteBatch
) => {
  const batch = batchArg || firestore().batch();

  const vendorLocationSnap = await firestore()
    .collection("VendorLocations")
    .where("vendor", "==", vendor)
    .get();
  await Promise.all(
    vendorLocationSnap.docs.map((doc) => deleteVendorLocation(doc.id, batch))
  );

  batch.delete(firestore().collection("Vendors").doc(vendor));

  if (!batchArg) {
    return batch.commit();
  }
};

export const listenToVendors = (
  onData: (vendors: { [id: string]: Vendor }) => void,
  params: { limit?: number; status?: Status; ids?: string[] } = {}
) => {
  let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =
    firestore().collection("Vendors").orderBy("updated", "desc");

  if (params.limit) {
    query = query.limit(params.limit);
  }

  if (params.status) {
    query = query.where("registration.status", "==", params.status);
  }

  if (params.ids) {
    query = query.where("id", "in", params.ids);
  }

  return query.onSnapshot((snap) => {
    const vendors = snap
      ? snap.docs.reduce((acc, doc) => {
          const vendor = doc.data() as Vendor;
          return { ...acc, [vendor.id]: vendor };
        }, {})
      : {};
    onData(vendors);
  });
};
