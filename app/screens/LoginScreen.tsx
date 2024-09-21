import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
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
import { Card } from "app/components/Card";
import { useAlert } from "app/hooks";
import { getAppType } from "app/utils/general";
import functions from "@react-native-firebase/functions";

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen = (_props: LoginScreenProps) => {
  const Alert = useAlert();

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

      if (getAppType() === "ADMIN") {
        const res = await functions().httpsCallable("isAdmin")({
          email: trimmedEmail,
        });
        if (!res.data) {
          setLoading(false);
          return Alert.alert("No access", "You are not an admin user.");
        }
      }

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
        ? ({ style }) => <ActivityIndicator color={"#fff"} style={style} />
        : undefined,
    [loading]
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
          tx="loginScreen.signIn"
          preset="heading"
          style={$signIn}
        />

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
        <Text
          style={$forgotPassword}
          onPress={() => _props.navigation.navigate("ChangePassword")}
        >
          Forgot password?
        </Text>

        <Button
          testID="login-button"
          tx="loginScreen.tapToSignIn"
          style={$tapButton}
          preset="filled"
          onPress={login}
          RightAccessory={Loading}
        />

        {(getAppType() === "CONSUMER" ||
          (getAppType() === "VENDOR" && Platform.OS === "web")) && (
          <Pressable onPress={() => _props.navigation.navigate("SignUp")}>
            <Text style={$loginMessage}>
              Don't have an account? <Text style={$loginText}>Sign Up</Text>
            </Text>
          </Pressable>
        )}
      </Card>
    </Screen>
  );
};

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
};

const $forgotPassword: TextStyle = {
  marginTop: spacing.xs,
  color: colors.textDim,
};

const $signIn: TextStyle = {};

const $textField: ViewStyle = {
  marginTop: spacing.md,
};

const $tapButton: ViewStyle = {
  marginTop: spacing.lg,
};

const $loginMessage: TextStyle = { marginTop: spacing.lg, textAlign: "center" };

const $loginText: TextStyle = {
  color: colors.palette.primary600,
};
