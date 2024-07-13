import React from "react";
import { View } from "react-native";
import { MenuCustomization, MenuItem } from "delivfree";
import { $menusScreenHeader } from "../../styles";
import { ScreenHeader } from "../../ScreenHeader";
import { MenuCustomizationsList } from "./MenuCustomizationsList";

interface Props {
  customizations: MenuCustomization[];
  items: MenuItem[];
  loaded: boolean;
  onAdd: () => void;
  onEdit: (item: MenuCustomization) => void;
}

export const MenuCustomizations = ({
  customizations,
  loaded,
  items,
  onAdd,
  onEdit,
}: Props) => {
  return (
    <View>
      <ScreenHeader
        title={"Customizations"}
        style={$menusScreenHeader}
        buttonTitle={"New customization"}
        onButtonPress={onAdd}
      />
      <MenuCustomizationsList
        customizations={customizations}
        items={items}
        onPress={onEdit}
        loaded={loaded}
      />
    </View>
  );
};
