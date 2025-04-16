import React from "react";
import { View } from "react-native";
import { MenuCustomization, MenuItem } from "delivfree";
import { $flex, $menusScreenHeader } from "../../styles";
import { ScreenHeader } from "../../ScreenHeader";
import { MenuCustomizationsList } from "./MenuCustomizationsList";
import { useListSearch } from "app/hooks/useListSearch";

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
  const { filteredItems, renderSearch } = useListSearch(
    customizations,
    queryExtractor
  );
  return (
    <View style={$flex}>
      <ScreenHeader
        title={"Customizations"}
        style={$menusScreenHeader}
        buttonTitle={"New customization"}
        onButtonPress={onAdd}
      />
      <MenuCustomizationsList
        ListHeaderComponent={renderSearch}
        customizations={filteredItems}
        items={items}
        onPress={onEdit}
        loaded={loaded}
      />
    </View>
  );
};

const queryExtractor = (item: MenuCustomization) => item.name;
