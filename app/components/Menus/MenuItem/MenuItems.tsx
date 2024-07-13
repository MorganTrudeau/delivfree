import React from "react";
import { View } from "react-native";
import { MenuCategory, MenuItem } from "delivfree";
import { $menusScreenHeader } from "../../styles";
import { ScreenHeader } from "../../ScreenHeader";
import { MenuItemsList } from "./MenuItemsList";

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
  return (
    <View>
      <ScreenHeader
        title={"Items"}
        style={$menusScreenHeader}
        buttonTitle={"New item"}
        onButtonPress={onAdd}
      />
      <MenuItemsList
        items={items}
        categories={categories}
        onPress={onEdit}
        loaded={loaded}
      />
    </View>
  );
};
