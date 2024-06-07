import React, { useCallback, useRef, useState } from "react";
import { Menu, MenuCategory } from "functions/src/types";
import { MenuCategoriesList } from "./MenuCategoriesList";
import { ScreenHeader } from "../../ScreenHeader";
import { $menusScreenHeader } from "../../styles";
import { ManageMenuCategoryModal } from "./ManageMenuCategoryModal";
import { BottomSheetRef } from "../../Modal/BottomSheet";

interface Props {
  categories: MenuCategory[];
  menus: Menu[];
  vendor: string;
  loaded: boolean;
}

export const MenuCategories = ({
  menus,
  categories,
  vendor,
  loaded,
}: Props) => {
  const manageModal = useRef<BottomSheetRef>(null);

  const [categoryEdit, setCategoryEdit] = useState<MenuCategory>();

  const handleOpenCategory = useCallback(() => {
    manageModal.current?.snapToIndex(0);
  }, []);
  const handleCloseManage = useCallback(() => {
    manageModal.current?.close();
  }, []);
  const handleCategoryPress = (category: MenuCategory) => {
    setCategoryEdit(category);
    handleOpenCategory();
  };

  return (
    <>
      <ScreenHeader
        title={"Categories"}
        buttonTitle={"New category"}
        onButtonPress={handleOpenCategory}
        style={$menusScreenHeader}
      />
      <MenuCategoriesList
        categories={categories}
        menus={menus}
        onPress={handleCategoryPress}
        loaded={loaded}
      />
      <ManageMenuCategoryModal
        ref={manageModal}
        menus={menus}
        vendor={vendor}
        category={categoryEdit}
        onClose={handleCloseManage}
      />
    </>
  );
};
