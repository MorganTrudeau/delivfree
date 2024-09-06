import React from "react";
import { Text, TextProps } from "../Text";
import { TextStyle } from "react-native";

export const Em = ({ style, ...rest }: TextProps) => {
  return <Text style={[$text, style]} {...rest} />;
};

const $text: TextStyle = { fontStyle: "italic" };
