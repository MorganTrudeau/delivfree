import { createUser, updateUser } from "app/apis/user";
import { Button, Screen, Text } from "app/components";
import { Card } from "app/components/Card";
import { TextInput } from "app/components/TextInput";
import { useAlert } from "app/hooks";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { User } from "functions/src/types";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextStyle,
  ViewStyle,
  TextInput as RNInput,
} from "react-native";

export const EditVendorProfileScreen = () => {
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

  const formComplete = !!(firstName && lastName);

  const handleCreateUser = useCallback(async () => {
    if (!(firstName && lastName)) {
      return Alert.alert(
        "Form incomplete",
        "Please enter your first and last name."
      );
    }
    const newUser = {
      id: authToken,
      firstName,
      lastName,
      vendor: {},
    };

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
          preset={formComplete ? "filled" : "default"}
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
