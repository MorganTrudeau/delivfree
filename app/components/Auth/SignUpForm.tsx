import React, { useMemo, useRef, useState } from "react";
import { Button } from "../Button";
import { TextField, TextFieldAccessoryProps } from "../TextField";
import auth from "@react-native-firebase/auth";
import { firebaseAuthErrorToMessage } from "app/utils/firebase";
import { ActivityIndicator, TextInput, ViewStyle } from "react-native";
import { colors, spacing } from "app/theme";
import { Icon } from "../Icon";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { setAnonymous } from "app/redux/reducers/auth";
import { logAnalytics } from "app/services/firebase/analytics";
import { useAlert } from "app/hooks";

export const SignUpForm = ({ onSignUp }: { onSignUp?: () => void }) => {
  const Alert = useAlert()

  const authPasswordInput = useRef<TextInput>(null);

  const authToken = useAppSelector((state) => state.auth.authToken);
  const dispatch = useAppDispatch();

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    try {
      setLoading(true);

      const email = authEmail.trim();
      const password = authPassword.trim();

      if (authToken) {
        const credential = auth.EmailAuthProvider.credential(email, password);
        await auth().currentUser?.linkWithCredential(credential);
        dispatch(setAnonymous(false));
        logAnalytics(`guest_create_account`);
        onSignUp && onSignUp();
      } else {
        await auth().createUserWithEmailAndPassword(email, password);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
    <>
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
        RightAccessory={Loading}
        disabled={!(authEmail.trim() && authPassword.trim())}
      />
    </>
  );
};

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
};
const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
};
