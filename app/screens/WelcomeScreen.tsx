import React from "react";
import { Dimensions, Platform, View, ViewStyle } from "react-native";
import { Button, Screen } from "../components";
import { AppStackScreenProps } from "../navigators";
import { colors, spacing } from "../theme";
import { logAnalytics } from "app/services/firebase/analytics";
import FastImage from "react-native-fast-image";
import {
  $flex,
  MAX_CONTAINER_WIDTH,
  SAFE_AREA_EDGES,
} from "app/components/styles";
import { Card } from "app/components/Card";
import { useDimensions } from "app/hooks/useDimensions";
import { getAppType } from "app/utils/general";

const IMAGE_WIDTH = Math.min(250, Dimensions.get("window").width * 0.85);
const IMAGE_HEIGHT = IMAGE_WIDTH * (813 / 2395);

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const { width } = useDimensions();
  const largeScreenLayout = width > MAX_CONTAINER_WIDTH;

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
      contentContainerStyle={[
        $content,
        largeScreenLayout && { justifyContent: "center" },
      ]}
      safeAreaEdges={SAFE_AREA_EDGES}
    >
      <Card smallStyle={$flex}>
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
          {(getAppType() === "CONSUMER" ||
            (getAppType() === "VENDOR" && Platform.OS === "web")) && (
            <Button
              testID="sign-up-button"
              preset="filled"
              text="Sign Up"
              style={$signUpButton}
              onPress={onSignUp}
            />
          )}
          <Button testID="log-in-button" text="Log In" onPress={onLogIn} />
        </View>
      </Card>
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
