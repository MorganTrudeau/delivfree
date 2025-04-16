import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { MenuNames } from "./Menu/MenuNames";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { Menu, MenuCategory, MenuItem } from "delivfree";
import { $menusScreenHeader } from "../styles";
import { MenuOverviewEmpty } from "./MenuOverviewEmpty";
import { MenuToolbar } from "./Menu/MenuToolbar";
import { MenuSortableList } from "./MenuSortableList";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useAlert, useToast } from "app/hooks";
import { saveCategoryOrder, saveItemOrder } from "app/apis/menus";

interface Props {
  onEditMenu: (menu: Menu) => void;
  onAddMenu: () => void;
  onEditCategory: (category: MenuCategory) => void;
  onAddCategory: (menu: string) => void;
  onEditItem: (item: MenuItem) => void;
  onAddItem: (category: string) => void;
  menus: Menu[];
  menusLoaded: boolean;
  categories: MenuCategory[];
  categoriesLoaded: boolean;
  items: MenuItem[];
  itemsLoaded: boolean;
}

export const MenuOverview = React.memo(function MenuOverview({
  onEditMenu,
  onAddMenu,
  menus,
  menusLoaded,
  categories,
  categoriesLoaded,
  items,
  itemsLoaded,
  onAddCategory,
  onEditCategory,
  onAddItem,
  onEditItem,
}: Props) {
  const Alert = useAlert();
  const Toast = useToast();

  const [categoryOrder, setCategoryOrder] = useState<{
    [category: string]: string[];
  }>({});
  const [itemOrder, setItemOrder] = useState<{ [category: string]: string[] }>(
    {}
  );
  const handleItemOrderChange = useCallback(
    (category: string, order: string[]) => {
      setItemOrder((state) => ({ ...state, [category]: order }));
    },
    []
  );
  const handleCategoryOrderChange = useCallback(
    (menu: string, order: string[]) => {
      setCategoryOrder((state) => ({ ...state, [menu]: order }));
    },
    []
  );

  const hasItemOrderChanges = useMemo(
    () => !!Object.values(itemOrder).length,
    [itemOrder]
  );
  const hasCategoryOrderChanges = useMemo(
    () => !!Object.values(categoryOrder).length,
    [categoryOrder]
  );
  const canSave = hasCategoryOrderChanges || hasItemOrderChanges;

  const [activeMenuId, setActiveMenuId] = useState("");
  const activeMenu = useMemo(
    () => menus.find((m) => m.id === activeMenuId),
    [menus, activeMenuId]
  );

  const handleMenuPress = useCallback(
    async (menu: Menu) => {
      if (canSave) {
        const shouldContinue = await new Promise((resolve) =>
          Alert.alert(
            "Unsaved changes",
            "Your changes will be lost by switching menus. Do you want to discard changes and switch menus?",
            [
              { text: "Cancel", onPress: () => resolve(false) },
              { text: "Switch menus", onPress: () => resolve(true) },
            ]
          )
        );
        if (!shouldContinue) {
          return;
        }
      }
      setActiveMenuId(menu.id);
      if (hasItemOrderChanges) {
        setItemOrder({});
      }
      if (hasCategoryOrderChanges) {
        setCategoryOrder({});
      }
    },
    [hasItemOrderChanges, hasCategoryOrderChanges, canSave]
  );

  const firstMenuId = menus[0]?.id;

  useEffect(() => {
    if (firstMenuId && !activeMenuId) {
      setActiveMenuId(firstMenuId);
    }
  }, [firstMenuId, activeMenuId]);

  const menuSections = useMemo(() => {
    if (!activeMenuId) {
      return [];
    }

    const menuCategories = categories.filter((c) =>
      c.menus.includes(activeMenuId)
    );
    const orderedCategories = categoryOrder[activeMenuId]?.length
      ? reorder(menuCategories, categoryOrder[activeMenuId])
      : menuCategories.sort(
          (a, b) => a.order[activeMenuId] - b.order[activeMenuId]
        );

    return orderedCategories
      .filter((c) => c.menus.includes(activeMenuId))
      .reduce((acc, category) => {
        const categoryItems = items.filter((i) =>
          i.categories.includes(category.id)
        );
        const orderedItems = itemOrder[category.id]?.length
          ? reorder(categoryItems, itemOrder[category.id])
          : categoryItems.sort(
              (a, b) => a.order[category.id] - b.order[category.id]
            );
        return [...acc, { category, items: orderedItems }];
      }, [] as { category: MenuCategory; items: MenuItem[] }[]);
  }, [activeMenuId, categories, items, itemOrder, categoryOrder]);

  const saveMenu = useCallback(async () => {
    if (!canSave) {
      return;
    }
    if (hasCategoryOrderChanges) {
      await saveCategoryOrder(categoryOrder);
      setCategoryOrder({});
    }
    if (hasItemOrderChanges) {
      await saveItemOrder(itemOrder);
      setItemOrder({});
    }
    Toast.show("Menu saved!");
  }, [
    hasCategoryOrderChanges,
    hasItemOrderChanges,
    itemOrder,
    categoryOrder,
    canSave,
  ]);

  const { exec: handleSaveMenu, loading: saveLoading } = useAsyncFunction<
    void,
    void
  >(saveMenu);

  return (
    <ScrollView>
      <MenuNames
        menus={menus}
        onAdd={onAddMenu}
        activeMenu={activeMenuId}
        onMenuPress={handleMenuPress}
        style={$menuNames}
      />
      {menusLoaded && (
        <Text preset={"heading"} style={$menusScreenHeader}>
          {activeMenu ? activeMenu.name : "Add your first menu"}
        </Text>
      )}
      {activeMenu && (
        <MenuToolbar
          menu={activeMenu}
          onEditMenu={onEditMenu}
          onSaveMenu={handleSaveMenu}
          canSave={canSave}
          saveLoading={saveLoading}
        />
      )}
      {!menusLoaded && (
        <ActivityIndicator
          color={colors.primary}
          style={{ margin: spacing.md }}
        />
      )}
      {!menus.length && menusLoaded && (
        <MenuOverviewEmpty onAddMenu={onAddMenu} />
      )}
      {menusLoaded && categoriesLoaded && itemsLoaded && (
        <MenuSortableList
          menu={activeMenuId}
          sections={menuSections}
          onItemOrderChange={handleItemOrderChange}
          onCategoryOrderChange={handleCategoryOrderChange}
          addCategory={onAddCategory}
          addItem={onAddItem}
        />
      )}
    </ScrollView>
  );
});

const $menuNames = { paddingTop: spacing.md };

const reorder = <V extends { id: string }>(arr: V[], order: string[]) => {
  const orderMap = {};
  order.forEach((id, index) => {
    orderMap[id] = index;
  });
  return arr.sort((a, b) => orderMap[a.id] - orderMap[b.id]);
};
