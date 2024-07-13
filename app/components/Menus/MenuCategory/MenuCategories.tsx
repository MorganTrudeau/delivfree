import React, { useCallback, useRef, useState } from "react";
import { Menu, MenuCategory } from "delivfree";
import { MenuCategoriesList } from "./MenuCategoriesList";
import { ScreenHeader } from "../../ScreenHeader";
import { $menusScreenHeader } from "../../styles";
import { ManageMenuCategoryModal } from "./ManageMenuCategoryModal";
import { BottomSheetRef } from "../../Modal/BottomSheet";

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
  return (
    <>
      <ScreenHeader
        title={"Categories"}
        buttonTitle={"New category"}
        onButtonPress={onAdd}
        style={$menusScreenHeader}
      />
      <MenuCategoriesList
        categories={categories}
        menus={menus}
        onPress={onEdit}
        loaded={loaded}
      />
    </>
  );
};
