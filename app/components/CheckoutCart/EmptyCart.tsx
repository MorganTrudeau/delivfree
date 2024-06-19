import React from "react";
import { View } from "react-native";
import { Icon } from "../Icon";
import { sizing } from "app/theme/sizing";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";

export const EmptyCart = () => (
  <View
    style={{
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: 300,
    }}
  >
    <Icon icon={"cart"} size={sizing.xxl} />
    <Text
      style={{
        color: colors.textDim,
        marginTop: spacing.sm,
        textAlign: "center",
      }}
    >
      Add items from a restaurant or store to start a new cart
    </Text>
  </View>
);
