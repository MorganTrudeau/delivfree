import React from "react";
import { Dimensions, TextStyle, View, ViewStyle } from "react-native";
import { Button, Screen, Text } from "../components";
import { AppStackScreenProps } from "../navigators";
import { colors, spacing } from "../theme";
import { logAnalytics } from "app/services/firebase/analytics";
import FastImage from "react-native-fast-image";
import { SAFE_AREA_EDGES } from "app/components/styles";

const IMAGE_SIZE = Math.min(233, Dimensions.get("window").width * 0.7);

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
      backgroundColor={colors.palette.neutral200}
      preset="scroll"
      style={$container}
      contentContainerStyle={$content}
      safeAreaEdges={SAFE_AREA_EDGES}
    >
      <View style={$topContainer}>
        <FastImage
          source={require("../../assets/images/splash-logo-all.png")}
          style={{
            height: IMAGE_SIZE,
            width: IMAGE_SIZE,
          }}
          resizeMode="contain"
        />
        {/* <Text preset="heading">SMARTICUS</Text> */}
      </View>

      <View style={$bottomContainer}>
        <Text size="md" style={$text}>
          Your first skill testing question:
        </Text>
        <Text preset="heading" size="xl" style={$text}>
          Do you have an account?
        </Text>
        <Text style={$helperText} size="md">
          (HINT: If no, sign up)
        </Text>
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

const $text: TextStyle = {
  textAlign: "center",
};

const $helperText: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  textAlign: "center",
};

const $signUpButton: ViewStyle = {
  marginTop: spacing.xl,
  marginBottom: spacing.md,
};

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral200,
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
