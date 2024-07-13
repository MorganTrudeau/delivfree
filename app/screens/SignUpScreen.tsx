import React, { FC, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {
  Button,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "../components";
import { AppStackScreenProps } from "../navigators";
import { colors, spacing } from "../theme";
import auth from "@react-native-firebase/auth";
import { firebaseAuthErrorToMessage } from "app/utils/firebase";
import { logAnalytics } from "app/services/firebase/analytics";
import { NO_TOP_BOTTOM_SAFE_AREA_EDGES } from "app/components/styles";
import { Card } from "app/components/Card";
import { useAlert } from "app/hooks";
import { getAppType } from "app/utils/general";
import { BottomSheet, BottomSheetRef } from "app/components/Modal/BottomSheet";

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = (_props) => {
  const Alert = useAlert();

  const authPasswordInput = useRef<TextInput>(null);
  const termsModal = useRef<BottomSheetRef>(null);

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const signup = async () => {
    try {
      const trimmedEmail = authEmail.trim();
      const trimmedPassword = authPassword.trim();

      if (!(trimmedEmail && trimmedPassword)) {
        return;
      }

      setLoading(true);
      await auth().createUserWithEmailAndPassword(
        trimmedEmail,
        trimmedPassword
      );
      logAnalytics(`sign_up_email`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert("Sign Up Failed", firebaseAuthErrorToMessage(error));
    }
  };

  const continueAsGuest = async () => {
    try {
      setGuestLoading(true);
      const token = await auth().signInAnonymously();
      console.log(token);
      logAnalytics(`sign_up_guest`);
      setGuestLoading(false);
    } catch (error) {
      console.log(error);
      setGuestLoading(false);
      Alert.alert("Sign Up Failed", firebaseAuthErrorToMessage(error));
    }
  };

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "hidden" : "view"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
            hitSlop={20}
          />
        );
      },
    [isAuthPasswordHidden]
  );

  const SignUpLoading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator color={"#fff"} style={style} />
        : undefined,
    [loading]
  );

  const GuestLoading = useMemo(
    () =>
      guestLoading
        ? ({ style }) => <ActivityIndicator color={colors.text} style={style} />
        : undefined,
    [guestLoading]
  );

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={NO_TOP_BOTTOM_SAFE_AREA_EDGES}
    >
      <Card>
        <Text
          testID="login-heading"
          tx="signUpScreen.signIn"
          preset="heading"
          style={$signIn}
        />
        {/* <Text tx="signUpScreen.enterDetails" preset="subheading" style={$enterDetails} /> */}

        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="signUpScreen.emailFieldLabel"
          placeholderTx="signUpScreen.emailFieldPlaceholder"
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />

        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          labelTx="signUpScreen.passwordFieldLabel"
          placeholderTx="signUpScreen.passwordFieldPlaceholder"
          onSubmitEditing={signup}
          RightAccessory={PasswordRightAccessory}
        />

        <Button
          testID="login-button"
          tx="signUpScreen.tapToSignIn"
          style={$tapButton}
          preset="filled"
          onPress={signup}
          RightAccessory={SignUpLoading}
        />

        <Text style={{ marginTop: spacing.sm, alignSelf: "center" }}>
          By signing up you are agreeing to the DelivFree{" "}
          <Text
            style={{ color: colors.primary }}
            onPress={() => termsModal.current?.snapToIndex(0)}
          >
            Terms and conditions
          </Text>
        </Text>

        {getAppType() === "CONSUMER" && (
          <>
            <Text preset="formLabel" style={$guestAccountTitle}>
              Don't want to create an account?
            </Text>
            <Button
              testID="login-button"
              text="Continue as guest"
              style={$tapButton}
              preset="default"
              onPress={continueAsGuest}
              RightAccessory={GuestLoading}
            />
          </>
        )}

        <BottomSheet ref={termsModal}>
          <View style={{ padding: spacing.md }}>
            <Text preset="subheading">Terms and conditions</Text>
          </View>
        </BottomSheet>

        {/* <Pressable onPress={() => _props.navigation.navigate("Login")}>
        <Text style={$loginMessage}>
          Already have an account? <Text style={$loginText}>Log In</Text>
        </Text>
      </Pressable> */}
      </Card>
    </Screen>
  );
};

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
};

const $signIn: TextStyle = {
  marginBottom: spacing.lg,
};

const $textField: ViewStyle = {
  marginBottom: spacing.md,
};

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
};

const $guestAccountTitle: TextStyle = {
  textAlign: "center",
  marginTop: spacing.xl,
};

const $guestAccountMessage: TextStyle = {
  textAlign: "center",
  marginBottom: spacing.md,
};

// const $loginMessage: TextStyle = { marginTop: spacing.lg, textAlign: "center" };

// const $loginText: TextStyle = {
//   color: colors.palette.primary600,
// };
