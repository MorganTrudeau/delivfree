import React from "react";
import { View } from "react-native";
import { Icon } from "../../Icon";
import { Text } from "../../Text";
import { ButtonSmall } from "../../ButtonSmall";
import { spacing } from "app/theme";
import { Menu } from "functions/src/types";
import { $borderBottom, $flex, $row } from "../../styles";

export const MenuToolbar = React.memo(function MenuToolbar({
  menu,
  onEditMenu,
  onSaveMenu,
  canSave,
}: {
  menu: Menu;
  onEditMenu: (_menu: Menu) => void;
  onSaveMenu: () => void;
  canSave: boolean;
}) {
  return (
    <View style={[$row, $borderBottom, { paddingVertical: spacing.sm }]}>
      <View style={[$row, $flex]}>
        <Icon
          icon={menu.active ? "eye" : "eye-off"}
          style={{ marginRight: spacing.xs }}
        />
        <Text>
          Menu is {menu.active ? "visible" : "not visible"} to customers.
        </Text>
      </View>
      <ButtonSmall
        text={"Edit menu"}
        style={{ marginLeft: spacing.md }}
        onPress={() => onEditMenu(menu)}
      />
      <ButtonSmall
        text={"Save menu"}
        style={{ marginLeft: spacing.md }}
        onPress={onSaveMenu}
        preset={canSave ? "filled" : "default"}
      />
    </View>
  );
});
