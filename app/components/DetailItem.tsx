import React from "react";
import { View } from "react-native";
import { Text } from "./Text";
import { spacing } from "app/theme";

export const DetailItem = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <View style={{ marginTop: spacing.xxs }}>
      <Text preset="semibold" size={"xs"}>
        {title}
      </Text>
      <Text>{value}</Text>
    </View>
  );
};
