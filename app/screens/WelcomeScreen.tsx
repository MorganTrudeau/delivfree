import React from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import { Button, Screen } from "../components";
import { AppStackScreenProps } from "../navigators";
import { colors, spacing } from "../theme";
import { logAnalytics } from "app/services/firebase/analytics";
import FastImage from "react-native-fast-image";
import { SAFE_AREA_EDGES } from "app/components/styles";

const IMAGE_WIDTH = Math.min(400, Dimensions.get("window").width * 0.85);
const IMAGE_HEIGHT = IMAGE_WIDTH * (838 / 2200);

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const onSignUp = () => {
    logAnalytics("welcome_signup");
    navigation.navigate("SignUp");
  };

  const onLogIn = () => {
    logAnalytics("welcome_login");
    navigation.navigate("Login");
  };

  return (
    <Screen
      backgroundColor={colors.background}
      preset="scroll"
      style={$container}
      contentContainerStyle={$content}
      safeAreaEdges={SAFE_AREA_EDGES}
    >
      <View style={$topContainer}>
        <FastImage
          source={require("../../assets/images/app-logo-tagline.png")}
          style={{
            height: IMAGE_HEIGHT,
            width: IMAGE_WIDTH,
          }}
          resizeMode="contain"
        />
      </View>

      <View style={$bottomContainer}>
        <Button
          testID="sign-up-button"
          preset="filled"
          text="Sign Up"
          style={$signUpButton}
          onPress={onSignUp}
        />
        <Button testID="log-in-button" text="Log In" onPress={onLogIn} />
      </View>
    </Screen>
  );
};

const $signUpButton: ViewStyle = {
  marginTop: spacing.xl,
  marginBottom: spacing.md,
};

const $container: ViewStyle = {
  flex: 1,
};

const $content: ViewStyle = {
  flexGrow: 1,
};

const $topContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const $bottomContainer: ViewStyle = {
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.lg,
};
