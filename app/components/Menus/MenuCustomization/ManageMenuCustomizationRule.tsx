import React, { useCallback, useMemo, useState } from "react";
import { MenuCustomization, MenuCustomizationRule } from "delivfree";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";
import { generateUid } from "app/utils/general";
import { $borderBottomLight, $flex, $row } from "app/components/styles";
import { ButtonSmall } from "app/components/ButtonSmall";
import { colors, spacing } from "app/theme";
import { Text } from "app/components/Text";
import { Toggle } from "app/components/Toggle";
import { Button } from "app/components/Button";
import { useAlert } from "app/hooks";
import { Icon } from "app/components/Icon";
import { borderRadius } from "app/theme/borderRadius";

interface Props {
  rule?: MenuCustomizationRule;
  sourceCustomization: string;
  customizations: MenuCustomization[];
  style?: ViewStyle;
  onSave: (rule: MenuCustomizationRule) => void;
}

export const ManageMenuCustomizationRule = ({
  rule,
  sourceCustomization,
  customizations,
  style,
  onSave,
}: Props) => {
  const Alert = useAlert();

  const [state, setState] = useState<MenuCustomizationRule>(
    rule
      ? { ...rule }
      : {
          id: generateUid(),
          title: "",
          customization: "",
          choices: [],
          condition: "requires",
        }
  );

  const customization = useMemo(
    () =>
      state.customization
        ? customizations.find((c) => c.id === state.customization)
        : undefined,
    [state.customization, customizations]
  );

  const choiceCustomizations = useMemo(
    () =>
      customizations.filter(
        (c) => c.type === "choices" && c.id !== sourceCustomization
      ),
    [customizations, sourceCustomization]
  );

  const handleSave = useCallback(() => {
    if (!state.choices.length) {
      return Alert.alert(
        "Choices required",
        "Please select at least once choice."
      );
    }
    onSave(state);
  }, [Alert, state, onSave]);

  const buildTitle = (
    c: MenuCustomization,
    condition: MenuCustomizationRule["condition"]
  ) =>
    `${condition === "excludes" ? "Unavailable" : "Only available"} with ${
      c.name
    }`;

  if (!customization) {
    return (
      <ScrollView contentContainerStyle={style}>
        <Text style={{ marginBottom: spacing.sm }}>
          Select a customization for your rule.
        </Text>
        {choiceCustomizations.map((customization) => (
          <Pressable
            key={customization.id}
            style={[{ paddingVertical: spacing.xs }, $borderBottomLight]}
            onPress={() =>
              setState((s) => ({
                ...s,
                customization: customization.id,
                choices: [],
                title: buildTitle(customization, state.condition),
              }))
            }
          >
            <Text>{customization.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={style}>
      <View style={$selectedCustomization}>
        <Text>{customization.name}</Text>
        <Pressable
          style={$editCustomizationButton}
          onPress={() =>
            setState((s) => ({ ...s, customization: "", choices: [] }))
          }
        >
          <Icon icon="pencil" />
        </Pressable>
      </View>
      <View style={[$row, $typeButtonContainer]}>
        <ButtonSmall
          text={"Available with choices"}
          style={[$typeButton, { marginRight: spacing.xs }]}
          preset={state.condition === "requires" ? "filled" : "default"}
          onPress={() =>
            setState((s) => ({
              ...s,
              condition: "requires",
              title: buildTitle(customization, "requires"),
            }))
          }
        />
        <ButtonSmall
          text={"Unavailable with choices"}
          style={$typeButton}
          preset={state.condition === "excludes" ? "filled" : "default"}
          onPress={() =>
            setState((s) => ({
              ...s,
              condition: "excludes",
              title: buildTitle(customization, "excludes"),
            }))
          }
        />
      </View>

      {customization.choices.map((choice) => {
        return (
          <Pressable
            key={choice.id}
            onPress={() =>
              setState((s) => ({
                ...s,
                choices: s.choices.includes(choice.id)
                  ? s.choices.filter((c) => c !== choice.id)
                  : [...s.choices, choice.id],
              }))
            }
            style={[{ paddingVertical: spacing.xs }, $row, $borderBottomLight]}
          >
            <View style={$flex}>
              <Text>{choice.name}</Text>
            </View>
            <Toggle value={state.choices.includes(choice.id)} />
          </Pressable>
        );
      })}

      <Button
        text={"Save"}
        onPress={handleSave}
        style={$button}
        preset={state.choices.length ? "filled" : "default"}
      />
    </View>
  );
};

const $typeButtonContainer: ViewStyle = { paddingBottom: spacing.sm };
const $typeButton: ViewStyle = {
  minHeight: 0,
  borderRadius: 100,
};
const $selectedCustomization: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.borderLight,
  paddingLeft: spacing.sm,
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing.md,
  borderRadius: borderRadius.md,
  justifyContent: "space-between",
};
const $editCustomizationButton: ViewStyle = { padding: spacing.sm };
const $button: ViewStyle = { marginTop: spacing.md };
