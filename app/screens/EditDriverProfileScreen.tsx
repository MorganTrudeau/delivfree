import { createUser, updateUser } from "app/apis/user";
import { Button, Icon, Screen, Text, TextField } from "app/components";
import { Card } from "app/components/Card";
import { PhoneNumberInput } from "app/components/PhoneNumberInput";
import { TextInput } from "app/components/TextInput";
import { $borderedArea, $row } from "app/components/styles";
import { useAlert } from "app/hooks";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { createDriver } from "app/redux/thunks/driver";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { generateUid } from "app/utils/general";
import { Driver, User } from "functions/src/types";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextStyle,
  ViewStyle,
  TextInput as RNInput,
  View,
} from "react-native";

export const EditDriverProfileScreen = () => {
  const Alert = useAlert();

  const lastNameInput = useRef<RNInput>(null);
  const phoneNumberInput = useRef<RNInput>(null);

  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const user = useAppSelector((state) => state.user.user);
  const driver = useAppSelector((state) => state.driver.data);

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [driverState, setDriverState] = useState<Driver>({
    id: generateUid(),
    firstName: driver?.firstName || "",
    lastName: driver?.lastName || "",
    callingCode: driver?.callingCode || "+1",
    phoneNumber: driver?.phoneNumber || "",
    registration: { status: "pending" },
    vendors: [],
    parentDrivers: {},
    user: authToken,
  });

  const updateState = (key: keyof Driver) => (val: string) => {
    setDriverState((s) => ({ ...s, [key]: val }));
  };

  const fieldsComplete =
    driverState.firstName && driverState.lastName && driverState.phoneNumber;

  const handleCreateDriver = useCallback(async () => {
    if (!fieldsComplete) {
      return Alert.alert(
        "Form incomplete",
        "Please complete all fields before continuing."
      );
    }
    const newUser: Pick<User, "id" | "firstName" | "lastName" | "driver"> = {
      id: authToken,
      firstName: driverState.firstName,
      lastName: driverState.lastName,
      driver: { id: driverState.id },
    };

    try {
      setLoading(true);
      if (user) {
        await updateUser(newUser.id, newUser);
      } else {
        await dispatch(createUser({ ...newUser, location: null }));
      }
      await dispatch(createDriver(driverState));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Something went wrong", "Please try that again.");
    }
  }, [driverState, authToken, dispatch, Alert]);

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
          Driver profile
        </Text>
        <TextField
          onChangeText={updateState("firstName")}
          placeholder="First name"
          label="First name"
          containerStyle={$input}
          value={driverState.firstName}
          returnKeyType={"next"}
          onSubmitEditing={() => lastNameInput.current?.focus()}
        />
        <TextField
          ref={lastNameInput}
          onChangeText={updateState("lastName")}
          placeholder="Last name"
          label="Last name"
          value={driverState.lastName}
          containerStyle={$input}
          onSubmitEditing={() => phoneNumberInput.current?.focus()}
        />
        <PhoneNumberInput
          ref={phoneNumberInput}
          onChangeText={updateState("phoneNumber")}
          onChangeCallingCode={updateState("callingCode")}
          placeholder="Phone number"
          label="Phone number"
          value={driverState.phoneNumber}
          containerStyle={$input}
        />
        {!driver?.registration ? (
          <Button
            preset={fieldsComplete ? "filled" : "default"}
            style={$button}
            text={"Continue"}
            onPress={handleCreateDriver}
            RightAccessory={Loading}
          />
        ) : (
          <View style={[$borderedArea, { marginTop: spacing.lg }]}>
            <Text>
              <Text preset="subheading">Registration Status: </Text>
              <Text size="lg">
                {getRegistrationStatusText(driver.registration.status)}
              </Text>
            </Text>
            {!!driver.registration.message ? (
              <View style={$row}>
                <Icon
                  icon="information"
                  color={colors.error}
                  size={sizing.md}
                />
                <Text style={{ marginLeft: spacing.xs }}>
                  {driver.registration.message}
                </Text>
              </View>
            ) : (
              <Text>
                Please wait while we review your registration submission. This
                will take 5-7 business days.
              </Text>
            )}
          </View>
        )}
      </Card>
    </Screen>
  );
};

const getRegistrationStatusText = (
  status: Driver["registration"]["status"]
) => {
  switch (status) {
    case "approved":
      return "Approved";
    case "declined":
      return "Declined";
    case "pending":
      return "Pending";
  }
};

const $screen = { padding: spacing.md };
const $header: TextStyle = { marginBottom: spacing.lg, alignSelf: "center" };
const $input: ViewStyle = { marginTop: spacing.sm };
const $button = { marginTop: spacing.lg };
