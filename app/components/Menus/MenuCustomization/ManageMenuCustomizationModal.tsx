import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { confirmDelete, generateUid } from "app/utils/general";
import {
  MenuCategory,
  MenuCustomization,
  MenuCustomizationChoice,
  MenuItem,
} from "delivfree";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  ScrollViewProps,
  View,
} from "react-native";
import { TextField } from "../../TextField";
import {
  $borderBottomLight,
  $borderTop,
  $flex,
  $formLabel,
  $inputFormContainer,
  $row,
} from "../../styles";
import { Text } from "../../Text";
import { colors, spacing } from "app/theme";
import { Button } from "../../Button";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { deleteMenuCustomization, saveMenuCustomization } from "app/apis/menus";
import { BottomSheet, BottomSheetRef } from "../../Modal/BottomSheet";
import { ButtonSmall } from "app/components/ButtonSmall";
import { useAlert } from "app/hooks";
import DraggableFlatList, {
  RenderItemParams,
  ShadowDecorator,
} from "react-native-draggable-flatlist";
import { Icon } from "app/components/Icon";
import { MenuItemsSearch } from "../MenuItem/MenuItemsSearch";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ManageCustomizationProps {
  vendor: string;
  customization?: MenuCustomization | null | undefined;
  items: MenuItem[];
  categories: MenuCategory[];
  onClose: () => void;
}

const ManageMenuItem = ({
  customization,
  items,
  categories,
  vendor,
  onClose,
}: ManageCustomizationProps) => {
  const Alert = useAlert();

  const [editItems, setEditItems] = useState(false);
  const [state, setState] = useState<MenuCustomization>(
    customization
      ? { ...customization }
      : {
          id: generateUid(),
          name: "",
          choices: [],
          minChoices: "0",
          maxChoices: "0",
          items: [],
          vendor,
        }
  );

  const choicesOrder = useMemo(
    () =>
      state.choices.reduce(
        (acc, choice, index) => ({ ...acc, [choice.id]: index }),
        {}
      ),
    [state.choices]
  );

  const updateState =
    <K extends keyof MenuCustomization>(key: K) =>
    (val: MenuCustomization[K]) => {
      setState((s) => ({ ...s, [key]: val }));
    };

  const handleSave = async () => {
    if (!state.name) {
      return Alert.alert(
        "Missing Title",
        "Please enter a title for your customization."
      );
    }
    if (!state.choices.length) {
      return Alert.alert(
        "Missing Choices",
        "Please enter choices for your customization."
      );
    }
    await saveMenuCustomization(state);
    onClose();
  };

  const { exec: onSave, loading } = useAsyncFunction(handleSave);

  const handleDelete = async () => {
    const shouldContinue = await confirmDelete(Alert);
    if (!shouldContinue) {
      return;
    }
    await deleteMenuCustomization(state.id);
    onClose();
  };

  const { exec: onDelete, loading: deleteLoading } =
    useAsyncFunction(handleDelete);

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [loading]
  );

  const handleChoicesReordered = useCallback(
    ({ data }: { data: MenuCustomizationChoice[] }) => {
      setState((s) => ({ ...s, choices: data }));
    },
    []
  );
  const choiceKeyExtractor = useCallback(
    (item: MenuCustomizationChoice) => item.id,
    []
  );
  const renderChoice = useCallback(
    ({ item: choice, drag }: RenderItemParams<MenuCustomizationChoice>) => {
      return (
        <ShadowDecorator>
          <View
            style={[
              { paddingBottom: spacing.sm, backgroundColor: colors.background },
              $borderTop,
            ]}
          >
            <Pressable
              onPressIn={drag}
              style={[
                $row,
                { paddingVertical: spacing.xs },
                $borderBottomLight,
              ]}
            >
              <Icon
                icon={"drag-vertical"}
                style={{ marginRight: spacing.xs }}
              />
              <Text size="xs">#{choicesOrder[choice.id] + 1} Choice</Text>
            </Pressable>
            <View
              style={[
                $row,
                {
                  paddingVertical: spacing.sm,
                  flexWrap: "wrap",
                  rowGap: spacing.xs,
                  columnGap: spacing.sm,
                },
              ]}
            >
              <TextField
                placeholder="Option name"
                value={choice.name}
                onChangeText={(name) =>
                  setState((s) => ({
                    ...s,
                    choices: s.choices.map((c) =>
                      c.id === choice.id ? { ...c, name } : c
                    ),
                  }))
                }
                inputWrapperStyle={$flex}
                containerStyle={[$flex, { minWidth: 200 }]}
                style={$flex}
              />
              <TextField
                placeholder="Extra charge"
                value={choice.price}
                onChangeText={(price) =>
                  setState((s) => ({
                    ...s,
                    choices: s.choices.map((c) =>
                      c.id === choice.id ? { ...c, price } : c
                    ),
                  }))
                }
                inputWrapperStyle={$flex}
                containerStyle={[$flex, { minWidth: 200 }]}
                style={$flex}
              />
            </View>
          </View>
        </ShadowDecorator>
      );
    },
    [choicesOrder]
  );

  const renderForm = () => {
    return (
      <>
        <TextField
          label="Customization title"
          placeholder="Ex. 'Milk options'"
          onChangeText={updateState("name")}
          containerStyle={$inputFormContainer}
          value={state.name}
        />

        <View style={[$inputFormContainer, { marginTop: spacing.lg }]}>
          <Text preset="formLabel" style={$formLabel}>
            Options
          </Text>
          <DraggableFlatList
            data={state.choices}
            renderItem={renderChoice}
            keyExtractor={choiceKeyExtractor}
            activationDistance={1}
            onDragEnd={handleChoicesReordered}
          />
          <ButtonSmall
            text="Add option"
            leftIcon="plus"
            style={{ alignSelf: "flex-start" }}
            onPress={() => {
              setState((s) => ({
                ...s,
                choices: [
                  ...s.choices,
                  { id: generateUid(), name: "", price: "" },
                ],
              }));
            }}
          />
        </View>

        <View
          style={[
            $row,
            $inputFormContainer,
            {
              flexWrap: "wrap",
              rowGap: spacing.xs,
              columnGap: spacing.sm,
              marginTop: spacing.lg,
            },
          ]}
        >
          <TextField
            onChangeText={(minChoices) =>
              setState((s) => ({ ...s, minChoices }))
            }
            label="Minimum choices"
            placeholder="Min choices"
            numberInput
            inputWrapperStyle={$flex}
            containerStyle={[$flex, { minWidth: 200 }]}
            style={$flex}
          />

          <TextField
            onChangeText={(maxChoices) =>
              setState((s) => ({ ...s, maxChoices }))
            }
            label="Maximum choices"
            placeholder="Max choices"
            numberInput
            inputWrapperStyle={$flex}
            containerStyle={[$flex, { minWidth: 200 }]}
            style={$flex}
          />
        </View>

        <View style={[$inputFormContainer, { marginTop: spacing.lg }]}>
          <Text preset="formLabel" style={$formLabel}>
            Menu items
          </Text>
          <Text>{state.items.length} items added</Text>
          <ButtonSmall
            text="Edit menu items"
            leftIcon="pencil"
            style={{ alignSelf: "flex-start", marginTop: spacing.xs }}
            onPress={() => {
              setEditItems(true);
            }}
          />
        </View>

        <Button
          text={"Save customization"}
          preset={state.name ? "filled" : "default"}
          onPress={onSave}
          style={{ marginTop: spacing.lg }}
          RightAccessory={Loading}
        />
      </>
    );
  };

  const renderEditItems = () => {
    return (
      <>
        <View>
          <Pressable
            onPress={() => setEditItems(false)}
            style={[$row, { marginBottom: spacing.sm }]}
          >
            <Icon
              icon={"arrow-left"}
              style={{ marginRight: spacing.xs }}
              color={colors.primary}
            />
            <Text style={{ color: colors.primary }}>Back to customization</Text>
          </Pressable>
          <Text preset="subheading">Edit menu items</Text>
          <Text size="xs" style={{ marginBottom: spacing.xs }}>
            Select which menu items show this customization
          </Text>
          <MenuItemsSearch
            items={items}
            categories={categories}
            selectedItems={state.items}
            onSelect={updateState("items")}
          />
        </View>
      </>
    );
  };

  return (
    <View style={$flex}>
      <View style={[$row, { marginBottom: spacing.xs }]}>
        <Text preset="heading" style={{ flex: 1 }}>
          {customization ? "Edit customization" : "New customization"}
        </Text>
        {customization && (
          <Pressable onPress={onDelete} style={$row}>
            {deleteLoading && (
              <ActivityIndicator
                color={colors.error}
                style={{ marginRight: spacing.xs }}
              />
            )}
            <Text style={{ color: colors.error }}>Delete</Text>
          </Pressable>
        )}
      </View>
      {editItems ? renderEditItems() : renderForm()}
    </View>
  );
};

const ScrollContainer = Platform.select<React.ComponentType<ScrollViewProps>>({
  web: ScrollView,
  default: BottomSheetScrollView as React.ComponentType<ScrollViewProps>,
});

export const ManageMenuCustomizationModal = forwardRef<
  BottomSheetRef,
  ManageCustomizationProps & { onDismiss?: () => void }
>(function ManageMenuCustomizationModal({ onDismiss, ...rest }, ref) {
  const insets = useSafeAreaInsets();
  return (
    <BottomSheet ref={ref} onClose={onDismiss}>
      <ScrollContainer
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: spacing.md + insets.bottom,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ManageMenuItem {...rest} />
      </ScrollContainer>
    </BottomSheet>
  );
});
