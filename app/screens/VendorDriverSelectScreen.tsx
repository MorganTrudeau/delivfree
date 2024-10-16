import { Button, Screen, Text } from "app/components";
import { Card } from "app/components/Card";
import { LogoutButton } from "app/components/LogoutButton";
import { $containerPadding, $flex } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import React from "react";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface EditVendorProfileScreenProps
  extends AppStackScreenProps<"VendorDriverSelect"> {}

export const VendorDriverSelectScreen = (
  props: EditVendorProfileScreenProps
) => {
  const insets = useSafeAreaInsets();

  const selectRole = (role: "driver" | "vendor") => () => {
    if (role === "driver") {
      props.navigation.navigate("DriverRegistration");
    } else {
      props.navigation.navigate("VendorRegistration");
    }
  };
  return (
    <Screen
      preset="scroll"
      contentContainerStyle={[
        $containerPadding,
        { paddingBottom: spacing.md + insets.bottom },
      ]}
    >
      <Card smallStyle={$flex}>
        <Text preset="heading">What is your role?</Text>
        <Text style={$message}>
          Choose whether you are registering as a Restaurant or a Driver.
        </Text>
        <Button
          text={"Vendor"}
          onPress={selectRole("vendor")}
          style={$button}
        />
        <Button
          text={"Driver"}
          onPress={selectRole("driver")}
          style={$button}
        />
      </Card>
      <LogoutButton style={{ marginTop: spacing.lg, alignSelf: "center" }} />
    </Screen>
  );
};

const $message: ViewStyle = { marginBottom: spacing.sm };
const $button: ViewStyle = { marginTop: spacing.sm };
