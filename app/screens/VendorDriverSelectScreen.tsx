import { Button, Screen, Text } from "app/components";
import { Card } from "app/components/Card";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import React from "react";
import { ViewStyle } from "react-native";

interface EditVendorProfileScreenProps
  extends AppStackScreenProps<"VendorDriverSelect"> {}

export const VendorDriverSelectScreen = (
  props: EditVendorProfileScreenProps
) => {
  const selectRole = (role: "driver" | "vendor") => () => {
    if (role === "driver") {
      props.navigation.navigate("EditDriverProfile");
    } else {
      props.navigation.navigate("EditVendorProfile");
    }
  };
  return (
    <Screen preset="scroll">
      <Card>
        <Text preset="heading">What is your role?</Text>
        <Text style={$message}>
          Choose whether you are registering as a Restaurant or a Driver.
        </Text>
        <Button
          text={"Restaurant"}
          onPress={selectRole("vendor")}
          style={$button}
        />
        <Button
          text={"Driver"}
          onPress={selectRole("driver")}
          style={$button}
        />
      </Card>
    </Screen>
  );
};

const $message: ViewStyle = { marginBottom: spacing.sm };
const $button: ViewStyle = { marginTop: spacing.sm };
