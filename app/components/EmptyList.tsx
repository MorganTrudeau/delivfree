import React from "react";
import { Text } from "./Text";
import { spacing } from "app/theme";
import { TextStyle } from "react-native";

interface Props {
  title: string;
}

export const EmptyList = ({ title }: Props) => {
  return (
    <Text preset="semibold" style={$text}>
      {title}
    </Text>
  );
};

const $text: TextStyle = {
  marginHorizontal: spacing.md,
  marginTop: spacing.md,
  textAlign: "center",
  alignSelf: "center",
};
