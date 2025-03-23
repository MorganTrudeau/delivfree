import React from "react";
import BottomSheetTextInput from "app/components/BottomSheetTextInput";
import { Icon } from "app/components/Icon";
import {
  $borderBottomLight,
  $borderTop,
  $flex,
  $row,
} from "app/components/styles";
import { Text } from "app/components/Text";
import { Toggle } from "app/components/Toggle";
import { colors, spacing } from "app/theme";
import { localizeCurrency } from "app/utils/general";
import { MenuCustomization, MenuCustomizationChoice } from "delivfree";
import { memo, useCallback } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { QuantitySelectorInline } from "app/components/QuantitySelectorInline";

export type ConsumerCustomizationProps = {
  customization: MenuCustomization;
  totalChoicesSelected: number;
  incomplete: boolean;
  choiceQuantities: { [choice: string]: number | undefined };
  onChangeNote: (id: string, note: string) => void;
  onSelectChoice: (
    customization: MenuCustomization,
    choice: MenuCustomizationChoice
  ) => void;
  onQuantityChange: (
    customization: MenuCustomization,
    choice: MenuCustomizationChoice,
    quantity: number
  ) => void;
};

export const ConsumerCustomization = memo(function ConsumerCustomization({
  customization,
  totalChoicesSelected,
  incomplete,
  onChangeNote,
  onSelectChoice,
  onQuantityChange,
  choiceQuantities,
}: ConsumerCustomizationProps) {
  const customizationId = customization.id;
  const handleChangeNote = useCallback(
    (note: string) => onChangeNote(customizationId, note),
    [customizationId]
  );
  const handleSelectChoice = useCallback(
    (choice: MenuCustomizationChoice) => onSelectChoice(customization, choice),
    [customization]
  );
  const handleChangeQuantity = useCallback(
    (choice: MenuCustomizationChoice, quantity: number) =>
      onQuantityChange(customization, choice, quantity),
    [customization]
  );
  return (
    <View
      style={[
        $borderTop,
        { paddingTop: spacing.sm, paddingBottom: spacing.xs },
      ]}
    >
      <Text preset="subheading">{customization.name}</Text>
      {((customization.type === "note" && customization.noteRequired) ||
        Number(customization.minChoices) > 0) && (
        <View style={$row}>
          <Text style={{ color: colors.textDim }} size={"xs"}>
            Required{" "}
            {Number(customization.minChoices)
              ? `${Number(customization.minChoices)} choices`
              : ""}
          </Text>
          {incomplete && (
            <Icon
              icon={"information"}
              size={15}
              color={colors.error}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      )}
      {!!Number(customization.maxChoices) && (
        <Text size="xs">
          Choices: {totalChoicesSelected}/{customization.maxChoices}
        </Text>
      )}
      {customization.type === "note" && (
        <BottomSheetTextInput
          placeholder={
            customization.noteInstruction || "Describe your customization..."
          }
          style={$input}
          onChangeText={handleChangeNote}
        />
      )}
      {customization.choices.map((choice, index, arr) => {
        return customization.allowsQuantity ? (
          <QuantityChoice
            key={choice.id}
            choice={choice}
            onChangeQuantity={handleChangeQuantity}
            isLastItem={index === arr.length - 1}
            quantity={choiceQuantities[choice.id] || 0}
          />
        ) : (
          <SelectChoice
            key={choice.id}
            choice={choice}
            onPress={handleSelectChoice}
            isLastItem={index === arr.length - 1}
            selected={!!choiceQuantities[choice.id]}
          />
        );
      })}
    </View>
  );
});

const SelectChoice = memo(function SelectChoice({
  choice,
  onPress,
  isLastItem,
  selected,
}: {
  choice: MenuCustomizationChoice;
  onPress: (choice: MenuCustomizationChoice) => void;
  isLastItem: boolean;
  selected: boolean;
}) {
  return (
    <Pressable
      onPress={() => onPress(choice)}
      style={[
        { paddingVertical: spacing.xs },
        $row,
        $borderBottomLight,
        isLastItem && { borderBottomWidth: 0 },
      ]}
    >
      <View style={$flex}>
        <Text>{choice.name}</Text>
        {!!choice.price && Number(choice.price) && (
          <Text size={"xs"}>
            +{localizeCurrency(Number(choice.price), "CAD")}
          </Text>
        )}
      </View>
      <Toggle value={selected} />
    </Pressable>
  );
});

const QuantityChoice = memo(function QuantityChoice({
  choice,
  onChangeQuantity,
  isLastItem,
  quantity,
}: {
  choice: MenuCustomizationChoice;
  onChangeQuantity: (choice: MenuCustomizationChoice, quantity: number) => void;
  isLastItem: boolean;
  quantity: number;
}) {
  return (
    <Pressable
      style={[
        { paddingVertical: spacing.xs },
        $row,
        $borderBottomLight,
        isLastItem && { borderBottomWidth: 0 },
      ]}
    >
      <View style={[$flex, { paddingRight: 5 }]}>
        <Text>{choice.name}</Text>
        {!!choice.price && Number(choice.price) && (
          <Text size={"xs"}>
            +{localizeCurrency(Number(choice.price), "CAD")}
          </Text>
        )}
      </View>
      <QuantitySelectorInline
        quantity={quantity}
        disableDecrease={quantity === 0}
        changeQuantity={(q) => {
          if (quantity + q < 0) {
            return;
          }
          onChangeQuantity(choice, quantity + q);
        }}
      />
    </Pressable>
  );
});

const $input: ViewStyle = { marginVertical: spacing.xs };
