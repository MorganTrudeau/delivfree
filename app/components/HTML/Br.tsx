import { spacing } from "app/theme";
import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

export const Br = ({ style, ...rest }: ViewProps) => {
  return <View style={[$view, style]} {...rest} />;
};

const $view: ViewStyle = {
  marginVertical: spacing.md,
};
