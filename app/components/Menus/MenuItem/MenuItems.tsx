import React from "react";
import { View } from "react-native";
import { MenuCategory, MenuItem } from "delivfree";
import { $flex, $menusScreenHeader } from "../../styles";
import { ScreenHeader } from "../../ScreenHeader";
import { MenuItemsList } from "./MenuItemsList";
import { useListSearch } from "app/hooks/useListSearch";

interface Props {
  items: MenuItem[];
  categories: MenuCategory[];
  loaded: boolean;
  onAdd: () => void;
  onEdit: (item: MenuItem) => void;
}

export const MenuItems = ({
  items,
  loaded,
  categories,
  onAdd,
  onEdit,
}: Props) => {
  const { filteredItems, renderSearch } = useListSearch(items, queryExtractor);
  return (
    <View style={$flex}>
      <ScreenHeader
        title={"Items"}
        style={$menusScreenHeader}
        buttonTitle={"New item"}
        onButtonPress={onAdd}
      />
      <MenuItemsList
        ListHeaderComponent={renderSearch}
        items={filteredItems}
        categories={categories}
        onPress={onEdit}
        loaded={loaded}
      />
    </View>
  );
};

const queryExtractor = (item: MenuItem) => item.name;
