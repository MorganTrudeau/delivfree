import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Menu, MenuCategory, MenuCustomization, MenuItem } from "delivfree";

export const saveCustomizationOrder = (item: string, order: string[]) => {
  const customizationCollection = firestore().collection("MenuCustomizations");
  const batch = firestore().batch();

  order.forEach((customization, index) => {
    batch.update(customizationCollection.doc(customization), {
      order: { [item]: index },
    });
  });

  return batch.commit();
};

export const saveCategoryOrder = (order: { [menu: string]: string[] }) => {
  const categoriesCollection = firestore().collection("MenuCategories");
  const batch = firestore().batch();

  Object.entries(order).forEach(([menu, categories]) => {
    categories.forEach((category, index) => {
      batch.update(categoriesCollection.doc(category), {
        order: { [menu]: index },
      });
    });
  });

  return batch.commit();
};

export const saveItemOrder = (order: { [category: string]: string[] }) => {
  const categoriesCollection = firestore().collection("MenuItems");
  const batch = firestore().batch();

  Object.entries(order).forEach(([category, items]) => {
    items.forEach((item, index) => {
      batch.update(categoriesCollection.doc(item), {
        order: { [category]: index },
      });
    });
  });

  return batch.commit();
};

export const listenToMenuCustomizations = (
  onData: (menus: MenuCustomization[]) => void,
  params: { item?: string; vendor?: string } = {},
  onError?: () => void
) => {
  const { item, vendor } = params;

  let query: FirebaseFirestoreTypes.Query =
    firestore().collection("MenuCustomizations");

  if (item) {
    query = query.where("items", "array-contains", item);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  return query.onSnapshot((snap) => {
    const menus = snap
      ? snap.docs.map((doc) => doc?.data() as MenuCustomization)
      : [];
    onData(menus);
  }, onError);
};

export const fetchMenuCustomizations = async (
  params: { item?: string; vendor?: string } = {}
) => {
  const { item, vendor } = params;

  let query: FirebaseFirestoreTypes.Query =
    firestore().collection("MenuCustomizations");

  if (item) {
    query = query.where("items", "array-contains", item);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  const snap = await query.get();
  return snap ? snap.docs.map((doc) => doc.data() as MenuCustomization) : [];
};

export const saveMenuCustomization = (customization: MenuCustomization) => {
  return firestore()
    .collection("MenuCustomizations")
    .doc(customization.id)
    .set(customization);
};

export const deleteMenuCustomization = (customization: string) => {
  return firestore()
    .collection("MenuCustomizations")
    .doc(customization)
    .delete();
};

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

export const fetchMenuItems = async (
  params: { category?: string; vendor?: string } = {}
) => {
  const { category, vendor } = params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("MenuItems");

  if (category) {
    query = query.where("categories", "array-contains", category);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  const snap = await query.get();
  return snap ? snap.docs.map((doc) => doc.data() as MenuItem) : [];
};

export const saveMenuItem = (item: MenuItem) => {
  return firestore().collection("MenuItems").doc(item.id).set(item);
};

export const deleteMenuItem = (id: string) => {
  return firestore().collection("MenuItems").doc(id).delete();
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

export const fetchMenuCategories = async (
  params: { menu?: string; vendor?: string } = {}
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

  const snap = await query.get();
  return snap ? snap.docs.map((doc) => doc.data() as MenuCategory) : [];
};

export const saveMenuCategory = (category: MenuCategory) => {
  return firestore()
    .collection("MenuCategories")
    .doc(category.id)
    .set(category);
};

export const deleteMenuCategory = (id: string) => {
  return firestore().collection("MenuCategories").doc(id).delete();
};

export const listenToMenus = (
  onData: (menus: Menu[]) => void,
  params: { vendorLocation?: string; vendor?: string } = {},
  onError?: () => void
) => {
  const { vendorLocation, vendor } = params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("Menus");

  if (vendorLocation) {
    query = query.where("vendorLocations", "array-contains", vendorLocation);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  return query.onSnapshot((snap) => {
    const menus = snap ? snap.docs.map((doc) => doc.data() as Menu) : [];
    onData(menus);
  }, onError);
};

export const fetchMenus = async (
  params: { vendorLocation?: string; vendor?: string } = {}
) => {
  const { vendorLocation, vendor } = params;

  let query: FirebaseFirestoreTypes.Query = firestore().collection("Menus");

  if (vendorLocation) {
    query = query.where("vendorLocations", "array-contains", vendorLocation);
  }

  if (vendor) {
    query = query.where("vendor", "==", vendor);
  }

  const snap = await query.get();
  return snap ? snap.docs.map((doc) => doc.data() as Menu) : [];
};

export const saveMenu = (menu: Menu) => {
  return firestore().collection("Menus").doc(menu.id).set(menu);
};

export const deleteMenu = (id: string) => {
  return firestore().collection("Menus").doc(id).delete();
};
