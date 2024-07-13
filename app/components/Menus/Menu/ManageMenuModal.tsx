import { generateUid } from "app/utils/general";
import { Menu } from "delivfree";
import React, { forwardRef, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { TextField } from "../../TextField";
import { $inputFormContainer, $spacerBorder } from "../../styles";
import { Text } from "../../Text";
import { spacing } from "app/theme";
import { Toggle } from "../../Toggle";
import { Button } from "../../Button";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { saveMenu } from "app/apis/menus";
import { useAlert } from "app/hooks";
import { BottomSheet, BottomSheetRef } from "../../Modal/BottomSheet";
import { DayAndTimeSelect } from "app/components/Dates/DayAndTimeSelect";

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
          hours: [{ days: [], startTime: null, endTime: null, allDay: false }],
          vendor,
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

      <View style={$spacerBorder} />

      <Text preset="subheading" style={{ marginBottom: spacing.sm }}>
        Set menu hours
      </Text>
      <DayAndTimeSelect
        daysAndTimes={menuState.hours[0]}
        onChange={(hours) =>
          setMenuState((state) => ({ ...state, hours: [hours] }))
        }
      />

      <View style={$spacerBorder} />

      <Button
        text={"Save menu"}
        preset={
          menuState.name &&
          menuState.hours[0]?.days.length &&
          ((menuState.hours[0]?.endTime && menuState.hours[0]?.startTime) ||
            menuState.hours[0]?.allDay)
            ? "filled"
            : "default"
        }
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
