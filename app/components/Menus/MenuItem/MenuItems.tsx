import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "app/theme";
import { MenuCategory, MenuItem } from "functions/src/types";
import { $menusScreenHeader } from "../../styles";
import { ScreenHeader } from "../../ScreenHeader";
import { MenuItemsList } from "./MenuItemsList";
import { ManageMenuItemModal } from "./ManageMenuItemModal";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";

interface Props {
  vendor: string;
  items: MenuItem[];
  categories: MenuCategory[];
  loaded: boolean;
}

export const MenuItems = ({ vendor, items, loaded, categories }: Props) => {
  const manageModal = useRef<BottomSheetRef>(null);

  const handleAdd = () => manageModal.current?.snapToIndex(0);
  const closeAddMenu = () => manageModal.current?.close();

  const [dataEdit, setEditMenu] = useState<MenuItem>();

  const onManageClose = useCallback(() => {
    if (dataEdit) {
      setEditMenu(undefined);
    }
  }, [dataEdit]);

  const handleEdit = useCallback((menu: MenuItem) => {
    setEditMenu(menu);
    manageModal.current?.snapToIndex(0);
  }, []);

  return (
    <View>
      <ScreenHeader
        title={"Items"}
        style={$menusScreenHeader}
        buttonTitle={"New item"}
        onButtonPress={handleAdd}
      />
      <MenuItemsList
        items={items}
        categories={categories}
        onPress={handleEdit}
        loaded={loaded}
      />
      <ManageMenuItemModal
        ref={manageModal}
        item={dataEdit}
        vendor={vendor}
        categories={categories}
        onClose={closeAddMenu}
        onDismiss={onManageClose}
      />
    </View>
  );
};
