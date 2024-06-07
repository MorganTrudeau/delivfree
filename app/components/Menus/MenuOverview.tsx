import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, View } from "react-native";
import { MenuNames } from "./Menu/MenuNames";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { ManageMenuModal } from "./Menu/ManageMenuModal";
import { Menu, MenuCategory, MenuItem } from "functions/src/types";
import { $menusScreenHeader } from "../styles";
import { MenuOverviewEmpty } from "./MenuOverviewEmpty";
import { MenuToolbar } from "./Menu/MenuToolbar";
import { BottomSheetRef } from "../Modal/BottomSheet";
import { MenuSortableList } from "./MenuSortableList";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";

interface Props {
  vendor: string;
  menus: Menu[];
  menusLoaded: boolean;
  categories: MenuCategory[];
  categoriesLoaded: boolean;
  items: MenuItem[];
  itemsLoaded: boolean;
}

export const MenuOverview = React.memo(function MenuOverview({
  vendor,
  menus,
  menusLoaded,
  categories,
  categoriesLoaded,
  items,
  itemsLoaded,
}: Props) {
  const manageMenuModal = useRef<BottomSheetRef>(null);

  const addMenu = useCallback(
    () => manageMenuModal.current?.snapToIndex(0),
    []
  );
  const closeAddMenu = useCallback(() => manageMenuModal.current?.close(), []);

  const [categoryOrder, setCategoryOrder] = useState<{
    [menu: string]: string[];
  }>({});
  const [itemOrder, setItemOrder] = useState<{
    [category: string]: string[];
  }>({});

  const [menuEdit, setEditMenu] = useState<Menu>();
  const [activeMenuId, setActiveMenuId] = useState("");
  const activeMenu = useMemo(
    () => menus.find((m) => m.id === activeMenuId),
    [menus, activeMenuId]
  );

  const handleMenuPress = useCallback((menu: Menu) => {
    setActiveMenuId(menu.id);
  }, []);

  const onManageMenuClose = useCallback(() => {
    if (menuEdit) {
      setEditMenu(undefined);
    }
  }, [menuEdit]);

  const handleEditMenu = useCallback((menu: Menu) => {
    setEditMenu(menu);
    manageMenuModal.current?.snapToIndex(0);
  }, []);

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
    const orderedCategories = categoryOrder[activeMenuId]
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
        const orderedItems = itemOrder[category.id]
          ? reorder(categoryItems, itemOrder[category.id])
          : categoryItems.sort(
              (a, b) => a.order[category.id] - b.order[category.id]
            );
        return [...acc, { category, items: orderedItems }];
      }, [] as { category: MenuCategory; items: MenuItem[] }[]);
  }, [activeMenuId, categories, items, itemOrder, categoryOrder]);

  const saveMenu = useCallback(async () => {}, []);

  const { exec: handleSaveMenu, loading: saveLoading } =
    useAsyncFunction(saveMenu);

  const canSave =
    !!categoryOrder[activeMenuId]?.length || !!itemOrder[activeMenuId]?.length;

  return (
    <View>
      <MenuNames
        menus={menus}
        onAdd={addMenu}
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
          onEditMenu={handleEditMenu}
          onSaveMenu={handleSaveMenu}
          canSave={canSave}
        />
      )}
      {!menusLoaded && (
        <ActivityIndicator
          color={colors.primary}
          style={{ margin: spacing.md }}
        />
      )}
      {!menus.length && menusLoaded && (
        <MenuOverviewEmpty onAddMenu={addMenu} />
      )}
      <MenuSortableList
        sections={menuSections}
        onItemOrderChange={(category, order) => {
          setItemOrder((s) => ({ ...s, [category]: order }));
        }}
        onCategoryOrderChange={(menu, order) => {
          setCategoryOrder((s) => ({ ...s, [menu]: order }));
        }}
        menu={activeMenuId}
      />
      <ManageMenuModal
        ref={manageMenuModal}
        vendor={vendor}
        onClose={closeAddMenu}
        menu={menuEdit}
        onDismiss={onManageMenuClose}
      />
    </View>
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
