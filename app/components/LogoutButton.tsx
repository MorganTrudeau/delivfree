import React from "react";
import auth from "@react-native-firebase/auth";
import { useAlert } from "app/hooks";
import { Pressable, ViewStyle } from "react-native";
import { Text } from "./Text";
import { colors } from "app/theme";

export const LogoutButton = ({ style }: { style?: ViewStyle }) => {
  const Alert = useAlert();

  const confirmLogout = async () => {
    try {
      await new Promise((resolve, reject) =>
        Alert.alert("Log Out", "Do you want to log out of your account?", [
          { text: "Cancel", onPress: reject },
          { text: "Log out", onPress: resolve },
        ])
      );
      await auth().signOut();
    } catch (error) {
      console.log("Log out cancelled");
    }
  };

  return (
    <Pressable onPress={confirmLogout} style={style}>
      <Text style={{ color: colors.textDim }}>Logout</Text>
    </Pressable>
  );
};
