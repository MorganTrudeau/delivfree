import { Screen } from "app/components";
import { MenuCategories } from "../../components/Menus/MenuCategory/MenuCategories";
import { MenuItems } from "../../components/Menus/MenuItem/MenuItems";
import { MenuOverview } from "app/components/Menus/MenuOverview";
import { Menus } from "../../components/Menus/Menu/Menus";
import { ListTabs, TabItem } from "app/components/Tabs";
import { $containerPadding, $screen } from "app/components/styles";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ManageMenuModal } from "app/components/Menus/Menu/ManageMenuModal";
import { ManageMenuCategoryModal } from "app/components/Menus/MenuCategory/ManageMenuCategoryModal";
import { useEditModalControl } from "app/hooks/useEditModalControl";
import { ManageMenuItemModal } from "app/components/Menus/MenuItem/ManageMenuItemModal";
import { Menu, MenuCategory, MenuCustomization, MenuItem } from "delivfree";
import { MenuCustomizations } from "app/components/Menus/MenuCustomization/MenuCustomizations";
import { ManageMenuCustomizationModal } from "app/components/Menus/MenuCustomization/ManageMenuCustomizationModal";

type VendorMenusScreenProps = AppStackScreenProps<"Menus">;

export const VendorMenusScreen = (props: VendorMenusScreenProps) => {
  const vendor = useAppSelector(
    (state) => state.vendor.activeVendor?.id as string
  );

  const tabParam = props.route.params?.tab;
  const initialIndex = useMemo(() => {
    if (tabParam) {
      const tabIndex = tabItems.findIndex((t) => t.id === tabParam);
      if (tabIndex >= 0) {
        return tabIndex;
      }
    }
    return 0;
  }, [tabParam]);

  const [activeTab, setActiveTab] = useState<(typeof tabItems)[number]["id"]>(
    tabItems[initialIndex].id
  );

  const {
    menus,
    loadMenus,
    menusLoaded,
    categories,
    loadCategories,
    categoriesLoaded,
    items,
    loadItems,
    itemsLoaded,
    customizations,
    customizationsLoaded,
    loadCustomizations,
  } = useMenusLoading({ vendor });

  useEffect(() => {
    loadMenus();
    loadCategories();
    loadItems();
    loadCustomizations();
  }, []);

  const renderTabView = () => {
    if (activeTab === "overview") {
      return (
        <MenuOverview
          menus={menus}
          menusLoaded={menusLoaded}
          categories={categories}
          categoriesLoaded={categoriesLoaded}
          items={items}
          itemsLoaded={itemsLoaded}
          onEditMenu={editMenu}
          onAddMenu={addMenu}
          onAddCategory={addCategory}
          onEditCategory={editCategory}
          onAddItem={addItem}
          onEditItem={editItem}
        />
      );
    }
    if (activeTab === "menus") {
      return (
        <Menus
          menus={menus}
          menusLoaded={menusLoaded}
          onEditMenu={editMenu}
          onAddMenu={addMenu}
        />
      );
    }
    if (activeTab === "categories") {
      return (
        <MenuCategories
          menus={menus}
          categories={categories}
          onAdd={addCategory}
          onEdit={editCategory}
          loaded={categoriesLoaded}
        />
      );
    }
    if (activeTab === "items") {
      return (
        <MenuItems
          items={items}
          categories={categories}
          loaded={itemsLoaded}
          onAdd={addItem}
          onEdit={editItem}
        />
      );
    }
    if (activeTab === "customizations") {
      return (
        <MenuCustomizations
          customizations={customizations}
          items={items}
          onAdd={addCustomization}
          onEdit={editCustomization}
          loaded={customizationsLoaded}
        />
      );
    }
    return null;
  };

  const handleTabPress = useCallback((tab: MenuTabItem) => {
    props.navigation.setParams({ tab: tab.id });
    setActiveTab(tab.id);
  }, []);

  const {
    modalRef: editMenuModal,
    onEdit: editMenu,
    onAdd: addMenu,
    closeModal: closeEditMenu,
    onModalClose: onEditMenuClose,
    itemEdit: menuEdit,
  } = useEditModalControl<Menu, undefined>();

  const {
    modalRef: editCategoryModal,
    onEdit: editCategory,
    onAdd: addCategory,
    closeModal: closeEditCategory,
    onModalClose: onEditCategoryClose,
    itemEdit: categoryEdit,
    parent: categoryMenu,
  } = useEditModalControl<MenuCategory, string>();

  const {
    modalRef: editItemModal,
    onEdit: editItem,
    onAdd: addItem,
    closeModal: closeEditItem,
    onModalClose: onEditItemClose,
    itemEdit,
    parent: itemCategory,
  } = useEditModalControl<MenuItem, string>();

  const {
    modalRef: editCustomizationModal,
    onEdit: editCustomization,
    onAdd: addCustomization,
    closeModal: closeEditCustomization,
    onModalClose: onEditCustomizationClose,
    itemEdit: customizationEdit,
  } = useEditModalControl<MenuCustomization, string>();

  return (
    <Screen
      style={$screen}
      contentContainerStyle={[$containerPadding, { minWidth: 550 }]}
      preset="scroll"
    >
      <ListTabs
        tabs={tabItems}
        onTabPress={handleTabPress}
        initialIndex={initialIndex}
      />
      {renderTabView()}
      <ManageMenuModal
        ref={editMenuModal}
        vendor={vendor}
        onClose={closeEditMenu}
        menu={menuEdit}
        onDismiss={onEditMenuClose}
      />

      <ManageMenuCategoryModal
        ref={editCategoryModal}
        menus={menus}
        vendor={vendor}
        category={categoryEdit}
        categoryMenu={categoryMenu}
        onClose={closeEditCategory}
        onDismiss={onEditCategoryClose}
      />

      <ManageMenuItemModal
        ref={editItemModal}
        item={itemEdit}
        itemCategory={itemCategory}
        vendor={vendor}
        categories={categories}
        onClose={closeEditItem}
        onDismiss={onEditItemClose}
        customizations={customizations}
      />

      <ManageMenuCustomizationModal
        ref={editCustomizationModal}
        customization={customizationEdit}
        vendor={vendor}
        onClose={closeEditCustomization}
        onDismiss={onEditCustomizationClose}
        items={items}
        categories={categories}
        customizations={customizations}
      />
    </Screen>
  );
};

type MenuTabItem = TabItem<
  "overview" | "categories" | "items" | "customizations" | "menus"
>;
const tabItems: MenuTabItem[] = [
  { id: "overview", title: "Overview" },
  { id: "menus", title: "Menus" },
  { id: "categories", title: "Categories" },
  { id: "items", title: "Items" },
  { id: "customizations", title: "Customizations" },
] as const;
