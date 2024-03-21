import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
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
import { NO_TOP_BOTTOM_SAFE_AREA_EDGES } from "app/components/styles";

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen = (_props: LoginScreenProps) => {
  const authPasswordInput = useRef<TextInput>(null);

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      const trimmedEmail = authEmail.trim();
      const trimmedPassword = authPassword.trim();
      if (!(trimmedEmail && trimmedPassword)) {
        return;
      }
      setLoading(true);
      await auth().signInWithEmailAndPassword(trimmedEmail, trimmedPassword);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert("Login Failed", firebaseAuthErrorToMessage(error));
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

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => (
            <ActivityIndicator color={colors.palette.accent500} style={style} />
          )
        : undefined,
    [loading]
  );

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={NO_TOP_BOTTOM_SAFE_AREA_EDGES}
    >
      <Text
        testID="login-heading"
        tx="loginScreen.signIn"
        preset="heading"
        style={$signIn}
      />
      {/* <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} /> */}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
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
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
        RightAccessory={Loading}
      />

      <Pressable onPress={() => _props.navigation.navigate("SignUp")}>
        <Text style={$loginMessage}>
          Don't have an account? <Text style={$loginText}>Sign Up</Text>
        </Text>
      </Pressable>
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

const $loginMessage: TextStyle = { marginTop: spacing.lg, textAlign: "center" };

const $loginText: TextStyle = {
  color: colors.palette.primary600,
};
