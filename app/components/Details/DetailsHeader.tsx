import React from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { spacing } from "app/theme";
import { $borderBottom, $flex, $row } from "../styles";
import { IconButton } from "../IconButton";
import { IconName } from "delivfree";

export const DetailsHeader = ({
  title,
  style,
  actionIcon,
  onAction,
}: {
  title: string;
  style?: ViewStyle;
  actionIcon?: IconName;
  onAction?: () => void;
}) => {
  return (
    <View
      style={[
        $borderBottom,
        $row,
        { paddingBottom: spacing.xs, marginBottom: spacing.xs },
        style,
      ]}
    >
      <Text preset="subheading" style={$flex}>
        {title}
      </Text>
      {!!actionIcon && onAction && (
        <IconButton icon={actionIcon} onPress={onAction} />
      )}
    </View>
  );
};
