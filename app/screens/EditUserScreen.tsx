import { Button, Screen, Text } from "app/components";
import { TextInput } from "app/components/TextInput";
import { spacing } from "app/theme";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextInput as RNInput,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { createUser, updateUser } from "app/apis/user";
import { useAlert } from "app/hooks";
import { Card } from "app/components/Card";
import { LogoutButton } from "app/components/LogoutButton";
import { getAppType } from "app/utils/general";
import { User } from "functions/src/types";

export const EditUserScreen = () => {
  const Alert = useAlert();

  const lastNameInput = useRef<RNInput>(null);
  const emailInput = useRef<RNInput>(null);

  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const firebaseUser = useAppSelector((state) => state.auth.user);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(firebaseUser?.email || "");

  const onFirstNameSubmit = useCallback(
    () => lastNameInput.current?.focus(),
    []
  );

  const onLastNameSubmit = useCallback(() => emailInput.current?.focus(), []);

  const handleCreateUser = useCallback(async () => {
    if (!(firstName && lastName)) {
      return Alert.alert(
        "Form incomplete",
        "Please enter your first and last name."
      );
    }
    const newUser: User = {
      id: authToken,
      firstName,
      lastName,
      email,
      location: null,
    };

    if (getAppType() === "ADMIN") {
      newUser.admin = {};
    } else {
      newUser.consumer = {};
    }

    try {
      setLoading(true);
      if (user) {
        await updateUser(newUser.id, newUser);
      } else {
        await dispatch(createUser({ ...newUser, location: null }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Something went wrong", "Please try that again.");
    }
  }, [firstName, lastName, authToken, dispatch, Alert]);

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator color={"#fff"} style={style} />
        : undefined,
    [loading]
  );

  return (
    <Screen preset={"scroll"} contentContainerStyle={$screen}>
      <Card>
        <Text style={$header} preset={"heading"} weight={"bold"}>
          What's your name?
        </Text>
        <TextInput
          onChangeText={setFirstName}
          placeholder="First Name"
          style={$input}
          value={firstName}
          returnKeyType={"next"}
          onSubmitEditing={onFirstNameSubmit}
        />
        <TextInput
          ref={lastNameInput}
          onChangeText={setLastName}
          placeholder="Last Name"
          value={lastName}
          style={$input}
          onSubmitEditing={onLastNameSubmit}
        />
        <TextInput
          ref={emailInput}
          onChangeText={setEmail}
          placeholder="Email"
          value={email}
          onSubmitEditing={handleCreateUser}
        />
        <Button
          preset={"filled"}
          style={$button}
          text={"Continue"}
          onPress={handleCreateUser}
          RightAccessory={Loading}
        />
      </Card>
      <LogoutButton style={{ marginTop: spacing.lg, alignSelf: "center" }} />
    </Screen>
  );
};

const $screen = { padding: spacing.md };
const $header: TextStyle = { marginBottom: spacing.lg, alignSelf: "center" };
const $input: ViewStyle = { marginBottom: spacing.md };
const $button = { marginTop: spacing.lg };
