import { Screen } from "app/components";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import React from "react";

type Props = AppStackScreenProps<"PrivacyPolicy">;

export const PrivacyPolicyScreen = (props: Props) => {
  return (
    <Screen style={$screen} contentContainerStyle={$containerPadding}>
      <ScreenHeader title="Privacy Policy" />
    </Screen>
  );
};
