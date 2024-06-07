import { Screen, Text } from "app/components";
import { Drawer } from "app/components/Drawer";
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
  } = useMenusLoading();

  useEffect(() => {
    loadMenus();
    loadCategories();
    loadItems();
  }, []);

  const renderTabView = () => {
    if (activeTab === "overview") {
      return (
        <MenuOverview
          menus={menus}
          menusLoaded={menusLoaded}
          categories={categories}
          categoriesLoaded={categoriesLoaded}
          vendor={vendor}
          items={items}
          itemsLoaded={itemsLoaded}
        />
      );
    }
    if (activeTab === "menus") {
      return <Menus menus={menus} menusLoaded={menusLoaded} vendor={vendor} />;
    }
    if (activeTab === "categories") {
      return (
        <MenuCategories
          menus={menus}
          categories={categories}
          vendor={vendor}
          loaded={menusLoaded}
        />
      );
    }
    if (activeTab === "items") {
      return (
        <MenuItems
          items={items}
          categories={categories}
          loaded={itemsLoaded}
          vendor={vendor}
        />
      );
    }
    return null;
  };

  const handleTabPress = useCallback((tab: MenuTabItem) => {
    props.navigation.setParams({ tab: tab.id });
    setActiveTab(tab.id);
  }, []);

  return (
    <Drawer navigation={props.navigation}>
      <Screen
        style={$screen}
        contentContainerStyle={$containerPadding}
        inDrawer
      >
        <ListTabs
          tabs={tabItems}
          onTabPress={handleTabPress}
          initialIndex={initialIndex}
        />
        {renderTabView()}
      </Screen>
    </Drawer>
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
