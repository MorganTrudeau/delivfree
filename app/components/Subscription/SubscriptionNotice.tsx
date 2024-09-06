import { useAppSelector } from "app/redux/store";
import React from "react";
import { Platform, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { selectSubscriptionValid } from "app/redux/selectors";

export const SubscriptionNotice = ({ style }: { style?: ViewStyle }) => {
  const userType = useAppSelector((state) => state.appConfig.userType);
  const subscriptionValid = useAppSelector((state) =>
    selectSubscriptionValid(state)
  );

  if (subscriptionValid || Platform.OS === "web") {
    return null;
  }

  return (
    <View
      style={[
        {
          backgroundColor: colors.palette.primary100,
          borderRadius: borderRadius.md,
          padding: spacing.md,
        },
        style,
      ]}
    >
      <Text>
        {userType === "driver"
          ? "Your license is not active. Please activate on our website "
          : "You have inactive drivers. Activate on our website "}
        <Text preset="semibold">business.delivfree.com.</Text>
      </Text>
    </View>
  );
};
