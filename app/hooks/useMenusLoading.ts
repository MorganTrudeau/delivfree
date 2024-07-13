import {
  fetchMenuCategories,
  fetchMenuCustomizations,
  fetchMenuItems,
  fetchMenus,
  listenToMenuCategories,
  listenToMenuCustomizations,
  listenToMenuItems,
  listenToMenus,
} from "app/apis/menus";
import {
  Menu,
  MenuCategory,
  MenuCustomization,
  MenuItem,
} from "delivfree";
import { useEffect, useRef, useState } from "react";
import { useToast } from "./useToast";
import { translate } from "app/i18n";

const cache: {
  menus: Menu[];
  menusLoaded: boolean;
  categories: MenuCategory[];
  categoriesLoaded: boolean;
  items: MenuItem[];
  itemsLoaded: boolean;
  customizations: MenuCustomization[];
  customizationsLoaded: boolean;
} = {
  menus: [],
  menusLoaded: false,
  categories: [],
  categoriesLoaded: false,
  items: [],
  itemsLoaded: false,
  customizations: [],
  customizationsLoaded: false,
};

export const useMenusLoading = ({
  vendorLocation,
  vendor,
  menu,
  category,
  item,
}: {
  vendorLocation?: string;
  vendor?: string;
  menu?: string;
  category?: string;
  item?: string;
} = {}) => {
  const Toast = useToast();

  const listeners = useRef<Set<() => void>>(new Set());

  const [{ menus, menusLoaded }, setMenus] = useState<{
    menus: Menu[];
    menusLoaded: boolean;
  }>({ menus: cache.menus, menusLoaded: cache.menusLoaded });

  const loadMenus = async (listen = true) => {
    if (!listen) {
      try {
        const _menus = await fetchMenus({ vendorLocation, vendor });
        setMenus({ menus: _menus, menusLoaded: true });
      } catch (error) {
        Toast.show(translate("errors.common"));
      }
    } else {
      listeners.current.add(
        listenToMenus(
          (_menus) => {
            setMenus({ menus: _menus, menusLoaded: true });
            cache.menus = _menus;
            cache.menusLoaded = true;
          },
          { vendorLocation, vendor },
          () => {
            Toast.show(translate("errors.common"));
          }
        )
      );
    }
  };

  const [{ categories, categoriesLoaded }, setCategories] = useState<{
    categories: MenuCategory[];
    categoriesLoaded: boolean;
  }>({
    categories: cache.categories,
    categoriesLoaded: cache.categoriesLoaded,
  });

  const loadCategories = async (listen = true) => {
    if (!listen) {
      try {
        const _categories = await fetchMenuCategories({ vendor, menu });
        setCategories({ categories: _categories, categoriesLoaded: true });
      } catch (error) {
        Toast.show(translate("errors.common"));
      }
    } else {
      listeners.current.add(
        listenToMenuCategories(
          (_categories) => {
            setCategories({ categories: _categories, categoriesLoaded: true });
          },
          { vendor, menu },
          () => {
            Toast.show(translate("errors.common"));
          }
        )
      );
    }
  };

  const [{ items, itemsLoaded }, setItems] = useState<{
    items: MenuItem[];
    itemsLoaded: boolean;
  }>({
    items: cache.items,
    itemsLoaded: cache.itemsLoaded,
  });

  const loadItems = async (listen = true) => {
    if (!listen) {
      try {
        const _items = await fetchMenuItems({ vendor, category });
        setItems({ items: _items, itemsLoaded: true });
      } catch (error) {
        Toast.show(translate("errors.common"));
      }
    } else {
      listeners.current.add(
        listenToMenuItems(
          (_items) => {
            setItems({ items: _items, itemsLoaded: true });
          },
          { vendor, category },
          () => {
            Toast.show(translate("errors.common"));
          }
        )
      );
    }
  };

  const [{ customizations, customizationsLoaded }, setCustomizations] =
    useState<{
      customizations: MenuCustomization[];
      customizationsLoaded: boolean;
    }>({
      customizations: cache.customizations,
      customizationsLoaded: cache.customizationsLoaded,
    });

  const loadCustomizations = async (listen = true) => {
    if (!listen) {
      try {
        const _customizations = await fetchMenuCustomizations({ vendor, item });
        setCustomizations({
          customizations: _customizations,
          customizationsLoaded: true,
        });
      } catch (error) {
        Toast.show(translate("errors.common"));
      }
    } else {
      listeners.current.add(
        listenToMenuCustomizations(
          (_customizations) => {
            setCustomizations({
              customizations: _customizations,
              customizationsLoaded: true,
            });
          },
          { vendor, item },
          () => {
            Toast.show(translate("errors.common"));
          }
        )
      );
    }
  };

  useEffect(() => {
    return () => {
      listeners.current.forEach((l) => l());
    };
  }, []);

  return {
    loadMenus,
    menusLoaded,
    menus,
    loadCategories,
    categories,
    categoriesLoaded,
    loadItems,
    items,
    itemsLoaded,
    customizations,
    customizationsLoaded,
    loadCustomizations,
  };
};
