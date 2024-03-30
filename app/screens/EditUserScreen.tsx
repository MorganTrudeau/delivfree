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
import { User } from "delivfree";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { createUser } from "app/apis/user";
import { useAlert } from "app/hooks";
import { getAppType } from "app/utils/general";
import { Card } from "app/components/Card";

export const EditUserScreen = () => {
  const Alert = useAlert();

  const lastNameInput = useRef<RNInput>(null);

  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [loading, setLoading] = useState(false);

  const onFirstNameSubmit = useCallback(
    () => lastNameInput.current?.focus(),
    []
  );

  const handleCreateUser = useCallback(async () => {
    if (!(firstName && lastName)) {
      return Alert.alert(
        "Form incomplete",
        "Please enter your first and last name."
      );
    }
    const user: User = {
      id: authToken,
      firstName,
      lastName,
      location: null,
    };

    if (getAppType() === "CONSUMER") {
      user.consumer = {};
    }

    try {
      setLoading(true);
      await dispatch(createUser(user));
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
          style={$firstNameInput}
          value={firstName}
          returnKeyType={"next"}
          onSubmitEditing={onFirstNameSubmit}
        />
        <TextInput
          ref={lastNameInput}
          onChangeText={setLastName}
          placeholder="Last Name"
          value={lastName}
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
    </Screen>
  );
};

const $screen = { padding: spacing.md };
const $header: TextStyle = { marginBottom: spacing.lg, alignSelf: "center" };
const $firstNameInput: ViewStyle = { marginBottom: spacing.md };
const $button = { marginTop: spacing.lg };
