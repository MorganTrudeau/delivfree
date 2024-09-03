import { Button, Screen, Text } from "app/components";
import { TextInput } from "app/components/TextInput";
import { colors, spacing } from "app/theme";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, TextStyle, ViewStyle } from "react-native";
import auth from "@react-native-firebase/auth";
import { isValidEmail } from "app/utils/general";
import { useAlert } from "app/hooks";
import { translate } from "app/i18n";
import { Card } from "app/components/Card";
import { useAppSelector } from "app/redux/store";

export const ChangePassword = () => {
  const Alert = useAlert();

  const activeEmail = useAppSelector((state) => state.auth.user?.email);

  const [email, setEmail] = useState(activeEmail || "");
  const [loading, setLoading] = useState(false);

  const validEmail = isValidEmail(email);

  const resetPassword = async () => {
    if (!validEmail) {
      return Alert.alert("Invalid Email", "Please enter a valid email");
    }
    try {
      setLoading(true);
      await auth().sendPasswordResetEmail(email);
      setLoading(false);
      return Alert.alert(
        "Check your email",
        "We have sent you a password reset link to your email. Click the link to reset your password."
      );
    } catch (error) {
      setLoading(false);
      return Alert.alert(
        translate("errors.heading"),
        translate("errors.common")
      );
    }
  };

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator color={colors.text} style={style} />
        : undefined,
    [loading]
  );

  return (
    <Card>
      <Text preset={"heading"} style={$heading}>
        Reset your password
      </Text>
      <Text>Enter your email and we will send you a password reset link.</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        style={$input}
      />
      <Button
        text="Reset Password"
        onPress={resetPassword}
        style={$button}
        preset="filled"
        RightAccessory={Loading}
      />
    </Card>
  );
};

const $heading: TextStyle = { marginBottom: spacing.xs };
const $input: ViewStyle = { marginTop: spacing.md };
const $button: ViewStyle = { marginTop: spacing.lg };
