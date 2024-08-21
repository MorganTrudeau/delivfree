import { Screen } from "app/components";
import { PrivacyPolicy } from "app/components/PrivacyPolicy";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { colors } from "app/theme";
import React from "react";
import WebView from "react-native-webview";

type Props = AppStackScreenProps<"PrivacyPolicy">;

export const PrivacyPolicyScreen = (props: Props) => {
  return (
    <Screen
      style={$screen}
      // contentContainerStyle={$containerPadding}
      backgroundColor={colors.palette.neutral200}
      preset="fixed"
    >
      <PrivacyPolicy />
    </Screen>
  );
};
