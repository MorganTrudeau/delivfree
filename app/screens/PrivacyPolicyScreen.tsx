import { Screen } from "app/components";
import { ScreenHeader } from "app/components/ScreenHeader";
import { AppStackScreenProps } from "app/navigators";
import React from "react";

type Props = AppStackScreenProps<"PrivacyPolicy">;

export const PrivacyPolicyScreen = () => {
  return (
    <Screen>
      <ScreenHeader title="Privacy Policy" />
    </Screen>
  );
};
