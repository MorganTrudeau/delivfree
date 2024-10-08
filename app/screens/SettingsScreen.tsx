import React from "react";
import { ListItem, Screen } from "app/components";
import { Linking } from "react-native";
import auth from "@react-native-firebase/auth";
import { AppStackScreenProps } from "app/navigators";
import {
  $borderBottom,
  $containerPadding,
  $screen,
} from "app/components/styles";
import { useAlert } from "app/hooks";
import { ScreenHeader } from "app/components/ScreenHeader";
import { useAppSelector } from "app/redux/store";

interface Props extends AppStackScreenProps<"Settings"> {}

export const SettingsScreen = ({ navigation, route }: Props) => {
  const Alert = useAlert();

  const userType = useAppSelector((state) => state.appConfig.userType);

  const confirmLogout = async () => {
    try {
      await new Promise((resolve, reject) =>
        Alert.alert("Log Out", "Do you want to log out of your account?", [
          { text: "No", onPress: reject },
          { text: "Yes", onPress: resolve },
        ])
      );
      await auth().signOut();
    } catch (error) {
      console.log("Log out cancelled");
    }
  };

  const navigateToAbout = () => {
    navigation.navigate("About");
  };

  const navigateToDeleteAccount = () => {
    navigation.navigate("DeleteAccount");
  };

  const navigateToChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const contactUs = async () => {
    const namespace =
      userType === "driver"
        ? "driversupport"
        : userType === "vendor"
        ? "merchantsupport"
        : "orderssupport";
    const url = `mailto:${namespace}@delivfree.com`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "That didn't work",
        `Failed to open your email app. Please email us at ${url}.`
      );
    }
  };

  return (
    <Screen
      preset="scroll"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <ScreenHeader title="Settings" />
      <ListItem
        onPress={contactUs}
        text="Contact Us"
        leftIcon="email-fast-outline"
        style={$borderBottom}
      />
      <ListItem
        onPress={navigateToAbout}
        text="About"
        leftIcon="information-outline"
        style={$borderBottom}
      />
      <ListItem
        onPress={navigateToChangePassword}
        text="Change password"
        leftIcon="key"
        style={$borderBottom}
      />
      <ListItem
        onPress={navigateToDeleteAccount}
        text="Delete Account"
        leftIcon="delete-forever-outline"
        style={$borderBottom}
      />
      <ListItem
        onPress={confirmLogout}
        text="Logout"
        style={$borderBottom}
        leftIcon="logout-variant"
      />
    </Screen>
  );
};
