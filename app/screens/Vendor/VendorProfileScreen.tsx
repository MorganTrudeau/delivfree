import { Screen, Text } from "app/components";
import { Drawer } from "app/components/Drawer";
import { TextInput } from "app/components/TextInput";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import React from "react";
import { TextStyle } from "react-native";

interface VendorProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const VendorProfileScreen = (props: VendorProfileScreenProps) => {
  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <Text preset="heading">Profile</Text>
        <Text style={$label}>First name</Text>
        <TextInput placeholder="First name" />
        <Text style={$label}>Last name</Text>
        <TextInput placeholder="Last name" />
        <Text style={$label}>Business name</Text>
        <TextInput placeholder="Business name" />
        <Text style={$label}>Phone number</Text>
        <TextInput placeholder="Phone number" />
      </Screen>
    </Drawer>
  );
};

const $label: TextStyle = {
  marginTop: spacing.sm,
  marginBottom: spacing.xxs,
};
