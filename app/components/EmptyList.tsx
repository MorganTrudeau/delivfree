import React from "react";
import { Text } from "./Text";
import { spacing } from "app/theme";
import { TextStyle } from "react-native";

interface Props {
  title: string;
}

export const EmptyList = ({ title }: Props) => {
  return (
    <Text preset="bold" style={$text}>
      {title}
    </Text>
  );
};

const $text: TextStyle = {
  margin: spacing.md,
  textAlign: "center",
  alignSelf: "center",
};
