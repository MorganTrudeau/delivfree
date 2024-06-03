import React from "react";
import { Pressable, TextStyle, ViewStyle } from "react-native";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { $flex } from "../styles";
import { Icon } from "../Icon";
import { sizing } from "app/theme/sizing";

type Props = {
  onPress: () => void;
  text: string;
  active?: boolean;
  checked?: boolean;
};

export const PopoverListItem = ({ onPress, text, active, checked }: Props) => {
  return (
    <Pressable onPress={onPress} style={$popoverItem}>
      <Text style={[$flex, active ? $activeFilterText : undefined]}>
        {text}
      </Text>
      {checked && <Icon icon={"check-circle"} size={sizing.md} />}
    </Pressable>
  );
};

const $popoverItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.xs,
};
const $activeFilterText: TextStyle = {
  color: colors.primary,
};
