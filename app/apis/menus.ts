import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Menu, MenuCategory, MenuItem } from "delivfree";

export const listenToMenuItems = (
  onData: (menus: MenuItem[]) => void,
  params: { category?: string; vendor?: string } = {},
  onError?: () => void
) => {
  const { category, vendor } = params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("MenuItems");

  if (category) {
    query = query.where("categories", "array-contains", category);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  return query.onSnapshot((snap) => {
    const menus = snap ? snap.docs.map((doc) => doc.data() as MenuItem) : [];
    onData(menus);
  }, onError);
};

export const saveMenuItem = (item: MenuItem) => {
  return firestore().collection("MenuItems").doc(item.id).set(item);
};

export const listenToMenuCategories = (
  onData: (menus: MenuCategory[]) => void,
  params: { menu?: string; vendor?: string } = {},
  onError?: () => void
) => {
  const { menu, vendor } = params;

  let query: FirebaseFirestoreTypes.Query =
    firestore().collection("MenuCategories");

  if (menu) {
    query = query.where("menus", "array-contains", menu);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  return query.onSnapshot((snap) => {
    const menus = snap
      ? snap.docs.map((doc) => doc.data() as MenuCategory)
      : [];
    onData(menus);
  }, onError);
};

export const saveMenuCategory = (category: MenuCategory) => {
  return firestore()
    .collection("MenuCategories")
    .doc(category.id)
    .set(category);
};

export const listenToMenus = (
  onData: (menus: Menu[]) => void,
  params: { vendorLocation?: string } = {},
  onError?: () => void
) => {
  const { vendorLocation } = params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("Menus");

  if (vendorLocation) {
    query = query.where("vendorLocations", "array-contains", vendorLocation);
  }

  return query.onSnapshot((snap) => {
    const menus = snap ? snap.docs.map((doc) => doc.data() as Menu) : [];
    onData(menus);
  }, onError);
};

export const saveMenu = (menu: Menu) => {
  return firestore().collection("Menus").doc(menu.id).set(menu);
};
