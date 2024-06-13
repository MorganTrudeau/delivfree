import React, { useMemo } from "react";
import { View } from "react-native";
import { Menu } from "functions/src/types";
import { $menusScreenHeader } from "../../styles";
import { ScreenHeader } from "../../ScreenHeader";
import { MenusList } from "./MenusList";

interface Props {
  menus: Menu[];
  menusLoaded: boolean;
  onAddMenu: () => void;
  onEditMenu: (menu: Menu) => void;
}

export const Menus = ({ menus, menusLoaded, onAddMenu, onEditMenu }: Props) => {
  const sortedMenus = useMemo(
    () => menus.sort((a, b) => (a.name < b.name ? -1 : 1)),
    [menus]
  );
  return (
    <View>
      <ScreenHeader
        title={"Menus"}
        style={$menusScreenHeader}
        buttonTitle={"New menu"}
        onButtonPress={onAddMenu}
      />
      <MenusList data={sortedMenus} onPress={onEditMenu} loaded={menusLoaded} />
    </View>
  );
};
