import React from "react";
import { Text } from "./Text";
import { spacing } from "app/theme";
import { TextStyle, View, ViewStyle } from "react-native";
import { Icon, IconTypes } from "./Icon";
import { sizing } from "app/theme/sizing";

interface Props {
  title: string;
  icon?: IconTypes;
}

export const EmptyList = ({ title, icon }: Props) => {
  return (
    <View style={$container}>
      {!!icon && <Icon icon={icon} size={sizing.xxl} />}
      <Text preset="semibold" style={$text}>
        {title}
      </Text>
    </View>
  );
};

const $container: ViewStyle = {
  alignSelf: "center",
  alignItems: "center",
};
const $text: TextStyle = {
  marginHorizontal: spacing.md,
  marginTop: spacing.md,
  textAlign: "center",
  alignSelf: "center",
};
