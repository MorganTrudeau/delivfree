import React, { FC, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TextStyle,
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

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = (_props) => {
  const authPasswordInput = useRef<TextInput>(null);

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
        ? ({ style }) => (
            <ActivityIndicator color={colors.palette.accent500} style={style} />
          )
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
        preset="reversed"
        onPress={signup}
        RightAccessory={SignUpLoading}
      />

      <Text preset="formLabel" style={$guestAccountTitle}>
        Don't want to create an account?
      </Text>
      <Text preset="formHelper" style={$guestAccountMessage}>
        Guest accounts won't save your progress, but you can create an account
        later.
      </Text>

      <Button
        testID="login-button"
        text="Continue as guest"
        style={$tapButton}
        preset="filled"
        onPress={continueAsGuest}
        RightAccessory={GuestLoading}
      />

      {/* <Pressable onPress={() => _props.navigation.navigate("Login")}>
        <Text style={$loginMessage}>
          Already have an account? <Text style={$loginText}>Log In</Text>
        </Text>
      </Pressable> */}
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
  marginBottom: spacing.lg,
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
