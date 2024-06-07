import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "app/theme";
import { ManageMenuModal } from "./ManageMenuModal";
import { Menu } from "functions/src/types";
import { ModalRef } from "../../Modal/CenterModal";
import { $menusScreenHeader } from "../../styles";
import { ScreenHeader } from "../../ScreenHeader";
import { MenusList } from "./MenusList";
import { BottomSheetRef } from "../../Modal/BottomSheet";

interface Props {
  vendor: string;
  menus: Menu[];
  menusLoaded: boolean;
}

export const Menus = ({ vendor, menus, menusLoaded }: Props) => {
  const manageMenuModal = useRef<BottomSheetRef>(null);

  const sortedMenus = useMemo(
    () => menus.sort((a, b) => (a.name < b.name ? -1 : 1)),
    [menus]
  );

  const addMenu = () => manageMenuModal.current?.snapToIndex(0);
  const closeAddMenu = () => manageMenuModal.current?.close();

  const [menuEdit, setEditMenu] = useState<Menu>();
  const [activeMenuId, setActiveMenuId] = useState("");
  const activeMenu = useMemo(
    () => menus.find((m) => m.id === activeMenuId),
    [menus, activeMenuId]
  );

  const handleMenuPress = (menu: Menu) => {
    setActiveMenuId(menu.id);
  };

  const onManageMenuClose = useCallback(() => {
    if (menuEdit) {
      setEditMenu(undefined);
    }
  }, [menuEdit]);

  const handleEditMenu = useCallback((menu: Menu) => {
    setEditMenu(menu);
    manageMenuModal.current?.snapToIndex(0);
  }, []);

  const firstMenuId = menus[0]?.id;

  useEffect(() => {
    if (firstMenuId && !activeMenuId) {
      setActiveMenuId(firstMenuId);
    }
  }, [firstMenuId, activeMenuId]);

  return (
    <View>
      <ScreenHeader
        title={"Menus"}
        style={$menusScreenHeader}
        buttonTitle={"New menu"}
        onButtonPress={addMenu}
      />
      <MenusList
        data={sortedMenus}
        onPress={handleEditMenu}
        loaded={menusLoaded}
      />
      <ManageMenuModal
        ref={manageMenuModal}
        vendor={vendor}
        onClose={closeAddMenu}
        menu={menuEdit}
        onDismiss={onManageMenuClose}
      />
    </View>
  );
};
