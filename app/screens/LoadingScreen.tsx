import { AppLogo } from "app/components/AppLogo";
import { colors, spacing } from "app/theme";
import React from "react";
import { ActivityIndicator, View, ViewStyle } from "react-native";

export const LoadingScreen = () => {
  return (
    <View style={$container}>
      <AppLogo height={60} />
      <ActivityIndicator
        size={"large"}
        color={colors.primary}
        style={$spinner}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};
const $spinner = {
  marginTop: spacing.md,
};
