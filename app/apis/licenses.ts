import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { License, Status } from "delivfree";
import functions from "@react-native-firebase/functions";

export const createLicense = (license: License) => {
  return functions().httpsCallable("createLicense")({ license });
};

export const deleteLicense = (license: string) => {
  return functions().httpsCallable("deleteLicense")({ license });
};

export const approveLicense = (license: string) => {
  return functions().httpsCallable("approveLicense")({ license });
};

export const denyLicense = (license: string, message: string | null) => {
  return functions().httpsCallable("denyLicense")({ license, message });
};

export const updateLicense = (license: string, update: Partial<License>) => {
  return firestore().collection("Licenses").doc(license).update(update);
};

export const fetchLicense = async (license: string) => {
  const doc = await firestore().collection("Licenses").doc(license).get();
  return doc.data() as License | undefined;
};

export const listenToLicense = (
  license: string,
  onData: (license: License | undefined) => void
) => {
  return firestore()
    .collection("Licenses")
    .doc(license)
    .onSnapshot((doc) => onData(doc?.data() as License | undefined));
};

type LicenseQueryParams = {
  status?: Status;
  driver?: string;
  vendor?: string;
  vendorLocation?: string;
};

const buildLicensesQuery = (params: LicenseQueryParams = {}) => {
  const { status, driver, vendor, vendorLocation } = params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("Licenses");

  if (status) {
    query = query.where("status", "==", status);
  }
  if (driver) {
    console.log("LOAD DRIVER", driver);
    query = query.where("driver", "==", driver);
  }
  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }
  if (vendorLocation) {
    query = query.where("vendorLocation", "==", vendorLocation);
  }

  return query;
};

export const fetchLicenses = async (params: LicenseQueryParams = {}) => {
  const snap = await buildLicensesQuery(params).get();
  return snap.docs.map((doc) => doc.data() as License);
};

export const listenToLicenses = (
  onData: (licenses: { [id: string]: License }) => void,
  params: LicenseQueryParams = {}
) => {
  let query: FirebaseFirestoreTypes.Query = buildLicensesQuery(params);

  return query.onSnapshot((snap) => {
    const licenses = snap
      ? snap.docs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.data() }), {})
      : {};
    onData(licenses);
  });
};
