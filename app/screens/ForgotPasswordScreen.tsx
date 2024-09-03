import { Screen } from "app/components";
import { spacing } from "app/theme";
import React from "react";
import { ViewStyle } from "react-native";
import { ChangePassword } from "app/components/ChangePassword";

export const ForgotPasswordScreen = () => {
  return (
    <Screen preset="scroll" style={$screen}>
      <ChangePassword />
    </Screen>
  );
};

const $screen: ViewStyle = {
  padding: spacing.md,
};
