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
  StyleSheet,
  View,
  ViewStyle,
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
import { Toggle } from "app/components/Toggle";

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
          noteRequired: false,
          name: "",
          noteInstruction: "",
          allowsQuantity: false,
          type: "choices",
          choices: [],
          maxQuantity: "",
          minChoices: "",
          maxChoices: "",
          items: [],
          vendor,
        }
  );

  const toggleQuantitySelection = useCallback(
    () => setState((s) => ({ ...s, allowsQuantity: !s.allowsQuantity })),
    []
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
    if (state.type === "choices" && !state.choices.length) {
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
                numberInput
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
          <View style={[$row, $typeButtonContainer]}>
            <ButtonSmall
              text={"Choices"}
              style={[$typeButton, { marginRight: spacing.xs }]}
              preset={state.type === "choices" ? "filled" : "default"}
              onPress={() =>
                setState((s) => ({
                  ...s,
                  type: "choices",
                  noteRequired: false,
                  noteInstruction: "",
                }))
              }
            />
            <ButtonSmall
              text={"Note"}
              style={$typeButton}
              preset={state.type === "note" ? "filled" : "default"}
              onPress={() =>
                setState((s) => ({
                  ...s,
                  type: "note",
                  choices: [],
                  minChoices: "",
                  maxChoices: "",
                }))
              }
            />
          </View>
          {state.type === "choices" ? (
            <>
              <DraggableFlatList
                data={state.choices}
                renderItem={renderChoice}
                keyExtractor={choiceKeyExtractor}
                activationDistance={1}
                onDragEnd={handleChoicesReordered}
              />
              <ButtonSmall
                text="Add choice"
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
            </>
          ) : (
            <>
              <TextField
                label={"Instruction"}
                placeholder={"Tell your customer what to write..."}
                maxLength={40}
                onChangeText={(noteInstruction) =>
                  setState((s) => ({ ...s, noteInstruction }))
                }
              />
            </>
          )}
        </View>

        {state.type === "note" ? (
          <Toggle
            label="Required"
            onValueChange={() =>
              setState((s) => ({ ...s, noteRequired: !s.noteRequired }))
            }
            value={state.noteRequired}
            containerStyle={{ marginTop: spacing.md }}
          />
        ) : (
          <View
            style={[
              $row,
              $inputFormContainer,
              {
                flexWrap: "wrap",
                rowGap: spacing.xs,
                columnGap: spacing.sm,
                marginTop: spacing.md,
              },
            ]}
          >
            <TextField
              onChangeText={(minChoices) =>
                setState((s) => ({ ...s, minChoices }))
              }
              label="Min choices"
              placeholder="Min choices"
              value={state.minChoices}
              numberInput
              inputWrapperStyle={$flex}
              containerStyle={[$flex, { minWidth: 200 }]}
              style={$flex}
            />

            <TextField
              onChangeText={(maxChoices) =>
                setState((s) => ({ ...s, maxChoices }))
              }
              value={state.maxChoices}
              label="Max choices"
              placeholder="Max choices"
              numberInput
              inputWrapperStyle={$flex}
              containerStyle={[$flex, { minWidth: 200 }]}
              style={$flex}
            />
          </View>
        )}

        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.border,
            marginVertical: spacing.md,
          }}
        />

        <Text preset="formLabel">Requires quantity selection</Text>
        <Text size="xs" style={[$formLabel, { color: colors.textDim }]}>
          Enable this setting if customers are required to select a quantity for
          their choice.
        </Text>
        <Pressable
          style={[$row, { marginTop: spacing.xxs }]}
          onPress={toggleQuantitySelection}
        >
          <Toggle
            value={state.allowsQuantity}
            containerStyle={{ marginRight: 2 }}
          />
          <Text size="sm">
            {state.allowsQuantity
              ? "Quantity selection enabled"
              : "Quantity selection disabled"}
          </Text>
        </Pressable>
        {state.allowsQuantity && (
          <TextField
            onChangeText={(maxQuantity) =>
              setState((s) => ({ ...s, maxQuantity }))
            }
            value={state.maxQuantity}
            label="Max quantity"
            placeholder="Max quantity"
            numberInput
            inputWrapperStyle={$flex}
            containerStyle={{ marginTop: spacing.sm }}
          />
        )}

        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.border,
            marginVertical: spacing.md,
          }}
        />

        <View>
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
          <Button
            text={"Save customization"}
            preset={state.name ? "filled" : "default"}
            onPress={onSave}
            style={{ marginTop: spacing.lg }}
            RightAccessory={Loading}
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

const $typeButtonContainer: ViewStyle = { paddingBottom: spacing.md };
const $typeButton: ViewStyle = {
  minHeight: 0,
  borderRadius: 100,
};
