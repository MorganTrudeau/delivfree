import React from "react";
import { Text } from "../Text";
import { TextStyle } from "react-native";
import { colors } from "app/theme";

export const MenuNextOpen = ({
  nextOpen,
  style,
}: {
  nextOpen: string;
  style?: TextStyle;
}) => {
  return <Text style={[$text, style]}>Opens {nextOpen}</Text>;
};

const $text: TextStyle = { color: colors.primary };
