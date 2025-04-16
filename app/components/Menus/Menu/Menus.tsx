import React, { useMemo } from "react";
import { View } from "react-native";
import { Menu } from "delivfree";
import { $menusScreenHeader } from "../../styles";
import { ScreenHeader } from "../../ScreenHeader";
import { MenusList } from "./MenusList";
import { useListSearch } from "app/hooks/useListSearch";

interface Props {
  menus: Menu[];
  menusLoaded: boolean;
  onAddMenu: () => void;
  onEditMenu: (menu: Menu) => void;
}

export const Menus = ({ menus, menusLoaded, onAddMenu, onEditMenu }: Props) => {
  const { filteredItems, renderSearch } = useListSearch(menus, queryExtractor);
  return (
    <View>
      <ScreenHeader
        title={"Menus"}
        style={$menusScreenHeader}
        buttonTitle={"New menu"}
        onButtonPress={onAddMenu}
      />
      <MenusList
        ListHeaderComponent={renderSearch}
        data={filteredItems}
        onPress={onEditMenu}
        loaded={menusLoaded}
      />
    </View>
  );
};

const queryExtractor = (item: Menu) => item.name;
