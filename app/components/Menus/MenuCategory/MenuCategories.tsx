import React from "react";
import { Menu, MenuCategory } from "delivfree";
import { MenuCategoriesList } from "./MenuCategoriesList";
import { ScreenHeader } from "../../ScreenHeader";
import { $menusScreenHeader } from "../../styles";
import { useListSearch } from "app/hooks/useListSearch";

interface Props {
  categories: MenuCategory[];
  menus: Menu[];
  loaded: boolean;
  onAdd: () => void;
  onEdit: (category: MenuCategory) => void;
}

export const MenuCategories = ({
  menus,
  categories,
  loaded,
  onAdd,
  onEdit,
}: Props) => {
  const { filteredItems, renderSearch } = useListSearch(
    categories,
    queryExtractor
  );
  return (
    <>
      <ScreenHeader
        title={"Categories"}
        buttonTitle={"New category"}
        onButtonPress={onAdd}
        style={$menusScreenHeader}
      />
      <MenuCategoriesList
        ListHeaderComponent={renderSearch}
        categories={filteredItems}
        menus={menus}
        onPress={onEdit}
        loaded={loaded}
      />
    </>
  );
};

const queryExtractor = (item: MenuCategory) => item.name;
