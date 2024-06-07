import { Menu } from "functions/src/types";
import React from "react";
import { View, ViewStyle } from "react-native";
import { $row } from "../../styles";
import { ButtonSmall } from "../../ButtonSmall";
import { colors, spacing } from "app/theme";
import { Icon } from "../../Icon";

interface Props {
  menus: Menu[];
  activeMenu?: string;
  onMenuPress: (menu: Menu) => void;
  onAdd: () => void;
  style?: ViewStyle;
}
export const MenuNames = React.memo(function MenuNames({
  menus,
  activeMenu,
  onAdd,
  onMenuPress,
  style,
}: Props) {
  if (!menus.length) {
    return null;
  }
  return (
    <View style={[$row, style]}>
      {menus.map((menu, index) => (
        <ButtonSmall
          text={menu.name}
          key={menu.id}
          style={[
            $button,
            activeMenu === menu.id ? $activeButton : $inactiveButton,
          ]}
          preset={activeMenu === menu.id ? "reversed" : "default"}
          onPress={() => onMenuPress(menu)}
        />
      ))}
      <Icon
        icon={"plus-circle"}
        size={35}
        color={colors.palette.neutral800}
        onPress={onAdd}
      />
    </View>
  );
});

const $button: ViewStyle = {
  borderWidth: 0,
  marginRight: spacing.sm,
};
const $inactiveButton: ViewStyle = { backgroundColor: colors.palette.shade200 };
const $activeButton: ViewStyle = { backgroundColor: colors.palette.neutral800 };
