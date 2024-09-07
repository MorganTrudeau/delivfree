import React from "react";
import { Text, TextProps } from "../Text";
import { TextStyle } from "react-native";
import { spacing } from "app/theme";

export const P = ({ style, ...rest }: TextProps) => {
  return <Text style={[$text, style]} {...rest} />;
};

const $text: TextStyle = { marginVertical: spacing.sm };
