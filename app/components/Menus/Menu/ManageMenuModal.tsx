import { generateUid } from "app/utils/general";
import { Menu } from "functions/src/types";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { TextField } from "../../TextField";
import { $inputFormContainer } from "../../styles";
import { Text } from "../../Text";
import { spacing } from "app/theme";
import { Toggle } from "../../Toggle";
import ReanimatedCenterModal, { ModalRef } from "../../Modal/CenterModal";
import { Button } from "../../Button";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { saveMenu } from "app/apis/menus";
import { useAlert } from "app/hooks";
import { BottomSheet, BottomSheetRef } from "../../Modal/BottomSheet";

interface ManageMenuProps {
  vendor: string;
  menu?: Menu | null | undefined;
  onClose?: () => void;
}

const ManageMenu = ({ menu, vendor, onClose }: ManageMenuProps) => {
  const Alert = useAlert();

  const [menuState, setMenuState] = useState<Menu>(
    menu
      ? { ...menu }
      : {
          id: generateUid(),
          name: "",
          active: true,
          hours: { times: "24-hours", days: "every-day" },
          vendor: vendor,
          vendorLocations: [],
        }
  );

  const updateState =
    <K extends keyof Menu>(key: K) =>
    (val: Menu[K]) => {
      setMenuState((s) => ({ ...s, [key]: val }));
    };

  const handleSave = async () => {
    if (!menuState.name) {
      return Alert.alert("Missing name", "Please enter a name for your menu.");
    }
    await saveMenu(menuState);
    onClose && onClose();
  };

  const { exec: onSave, loading } = useAsyncFunction(handleSave);

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [loading]
  );

  return (
    <View style={{ padding: spacing.md }}>
      <Text preset="heading" style={{ marginBottom: spacing.xs }}>
        {menu ? "Edit menu" : "New menu"}
      </Text>
      <TextField
        placeholder="Menu name"
        label="Menu name"
        onChangeText={updateState("name")}
        containerStyle={$inputFormContainer}
        value={menuState.name}
      />
      <Toggle
        label="Menu is active"
        value={menuState.active}
        containerStyle={$inputFormContainer}
        helper={"Customers can view and order from this menu"}
        onValueChange={updateState("active")}
        labelPosition="left"
      />
      <Button
        text={"Save menu"}
        preset={menuState.name ? "filled" : "default"}
        onPress={onSave}
        style={{ marginTop: spacing.md }}
        RightAccessory={Loading}
      />
    </View>
  );
};

export const ManageMenuModal = forwardRef<
  BottomSheetRef,
  ManageMenuProps & { onDismiss?: () => void }
>(function ManageMenuModal({ onDismiss, ...rest }, ref) {
  return (
    <BottomSheet ref={ref} onClose={onDismiss}>
      <ManageMenu {...rest} />
    </BottomSheet>
  );
});
