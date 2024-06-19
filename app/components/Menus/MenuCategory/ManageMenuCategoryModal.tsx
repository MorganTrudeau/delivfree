import { generateUid } from "app/utils/general";
import { Menu, MenuCategory } from "functions/src/types";
import React, { forwardRef, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { TextField } from "../../TextField";
import { $inputFormContainer, $row } from "../../styles";
import { Text } from "../../Text";
import { spacing } from "app/theme";
import { Button } from "../../Button";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { saveMenuCategory } from "app/apis/menus";
import { useAlert } from "app/hooks";
import { BottomSheet, BottomSheetRef } from "../../Modal/BottomSheet";
import { Toggle } from "../../Toggle";

interface ManageMenuProps {
  vendor: string;
  category?: MenuCategory | null | undefined;
  categoryMenu?: string | null | undefined;
  menus: Menu[];
  onClose: () => void;
}

const ManageMenuCategory = ({
  category,
  categoryMenu,
  menus,
  vendor,
  onClose,
}: ManageMenuProps) => {
  const Alert = useAlert();

  const [state, setState] = useState<MenuCategory>(
    category
      ? { ...category }
      : {
          id: generateUid(),
          name: "",
          vendor,
          menus: categoryMenu ? [categoryMenu] : [],
          order: {},
        }
  );

  const updateState =
    <K extends keyof MenuCategory>(key: K) =>
    (val: MenuCategory[K]) => {
      setState((s) => ({ ...s, [key]: val }));
    };

  const handleSave = async () => {
    if (!state.name) {
      return Alert.alert(
        "Missing name",
        "Please enter a name for your category."
      );
    }
    await saveMenuCategory(state);
    onClose();
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
        {category ? "Edit category" : "New category"}
      </Text>
      <TextField
        placeholder="Category name"
        label="Category name"
        onChangeText={updateState("name")}
        containerStyle={$inputFormContainer}
        value={state.name}
      />
      <View
        style={[
          $row,
          {
            rowGap: spacing.xs,
            columnGap: spacing.md,
            flexWrap: "wrap",
            paddingTop: spacing.md,
          },
        ]}
      >
        {menus.map((menu) => (
          <Toggle
            label={menu.name}
            value={state.menus.includes(menu.id)}
            onValueChange={(enabled) =>
              setState((s) => ({
                ...s,
                menus: s.menus.includes(menu.id)
                  ? s.menus.filter((id) => id !== menu.id)
                  : [...s.menus, menu.id],
              }))
            }
          />
        ))}
      </View>
      <Button
        text={"Save category"}
        preset={state.name ? "filled" : "default"}
        onPress={onSave}
        style={{ marginTop: spacing.md }}
        RightAccessory={Loading}
      />
    </View>
  );
};

export const ManageMenuCategoryModal = forwardRef<
  BottomSheetRef,
  ManageMenuProps & { onDismiss?: () => void }
>(function ManageMenuCategoryModal({ onDismiss, ...rest }, ref) {
  return (
    <BottomSheet ref={ref} onClose={onDismiss}>
      <ManageMenuCategory {...rest} />
    </BottomSheet>
  );
});
