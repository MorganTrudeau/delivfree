import {
  listenToMenuCategories,
  listenToMenuItems,
  listenToMenus,
} from "app/apis/menus";
import { Menu, MenuCategory, MenuItem } from "functions/src/types";
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
} = {
  menus: [],
  menusLoaded: false,
  categories: [],
  categoriesLoaded: false,
  items: [],
  itemsLoaded: false,
};

export const useMenusLoading = ({
  vendorLocation,
  vendor,
  menu,
  category,
}: {
  vendorLocation?: string;
  vendor?: string;
  menu?: string;
  category?: string;
} = {}) => {
  const Toast = useToast();

  const listeners = useRef<Set<() => void>>(new Set());

  const [{ menus, menusLoaded }, setMenus] = useState<{
    menus: Menu[];
    menusLoaded: boolean;
  }>({ menus: cache.menus, menusLoaded: cache.menusLoaded });

  const loadMenus = () => {
    listeners.current.add(
      listenToMenus(
        (_menus) => {
          setMenus({ menus: _menus, menusLoaded: true });
          cache.menus = _menus;
          cache.menusLoaded = true;
        },
        { vendorLocation },
        () => {
          Toast.show(translate("errors.common"));
        }
      )
    );
  };

  const [{ categories, categoriesLoaded }, setCategories] = useState<{
    categories: MenuCategory[];
    categoriesLoaded: boolean;
  }>({
    categories: cache.categories,
    categoriesLoaded: cache.categoriesLoaded,
  });

  const loadCategories = () => {
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
  };

  const [{ items, itemsLoaded }, setItems] = useState<{
    items: MenuItem[];
    itemsLoaded: boolean;
  }>({
    items: cache.items,
    itemsLoaded: cache.itemsLoaded,
  });

  const loadItems = () => {
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
  };
};
