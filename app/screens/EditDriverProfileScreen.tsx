import { createUser, updateUser } from "app/apis/user";
import { Button, Icon, Screen, Text, TextField } from "app/components";
import { AddressSearchModal } from "app/components/AddressSearchModal";
import { Card } from "app/components/Card";
import { DriversLicenseUpload } from "app/components/DriversLicenseUpload";
import { LocationInput } from "app/components/LocationInput";
import { LogoutButton } from "app/components/LogoutButton";
import { ModalRef } from "app/components/Modal/CenterModal";
import { PhoneNumberInput } from "app/components/PhoneNumberInput";
import { StatusIndicator } from "app/components/StatusIndicator";
import {
  $borderedArea,
  $flex,
  $formLabel,
  $input,
  $row,
} from "app/components/styles";
import { useAlert, useToast } from "app/hooks";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { createDriver } from "app/redux/thunks/driver";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { generateUid, isValidEmail } from "app/utils/general";
import { Driver, Status, User } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextStyle,
  ViewStyle,
  TextInput as RNInput,
  View,
  Pressable,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";

export const EditDriverProfileScreen = () => {
  const Alert = useAlert();
  const Toast = useToast();

  const lastNameInput = useRef<RNInput>(null);
  const phoneNumberInput = useRef<PhoneInput>(null);
  const addressSearch = useRef<ModalRef>(null);

  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const user = useAppSelector((state) => state.user.user);
  const driver = useAppSelector((state) => state.driver.activeDriver);

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [driverState, setDriverState] = useState<Driver>(
    driver || {
      id: generateUid(),
      firstName: "",
      lastName: "",
      callingCountry: "CA",
      callingCode: "+1",
      phoneNumber: "",
      registration: { status: "pending", message: null },
      vendors: [],
      vendorLocations: [],
      email: user?.email || "",
      user: authToken,
      updated: Date.now(),
      location: { latitude: 0, longitude: 0, geohash: "", address: "" },
      licenses: [],
      pendingLicenses: [],
      driversLicenseFront: "",
      driversLicenseBack: "",
      referralCode: "",
    }
  );

  const updateState = (key: keyof Driver) => (val: string) => {
    setDriverState((s) => ({ ...s, [key]: val }));
  };

  const fieldsComplete =
    driverState.firstName &&
    driverState.lastName &&
    driverState.phoneNumber &&
    driverState.email &&
    driverState.driversLicenseFront &&
    driverState.driversLicenseBack;

  const handleCreateDriver = useCallback(async () => {
    if (!fieldsComplete) {
      return Alert.alert(
        "Form incomplete",
        "Please complete all fields before continuing."
      );
    }
    if (!isValidEmail(driverState.email)) {
      return Alert.alert("Invalid email", "Please enter a valid email.");
    }
    const newUser: Pick<
      User,
      | "id"
      | "firstName"
      | "lastName"
      | "email"
      | "driver"
      | "location"
      | "deliveryInstructions"
      | "phoneNumber"
      | "callingCode"
      | "callingCountry"
    > = {
      id: authToken,
      firstName: driverState.firstName,
      lastName: driverState.lastName,
      email: driverState.email,
      driver: { id: driverState.id },
      location: driverState.location,
      deliveryInstructions: { type: "meet-door", note: "" },
      phoneNumber: null,
      callingCode: null,
      callingCountry: null,
    };

    try {
      setLoading(true);
      if (user) {
        await updateUser(newUser.id, newUser);
      } else {
        await dispatch(
          createUser({ ...newUser, location: driverState.location })
        );
      }
      await dispatch(createDriver(driverState));
      Toast.show("Driver profile sent for review");
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
      <Card smallStyle={$flex}>
        <Text style={$header} preset={"heading"} weight={"bold"}>
          Driver profile
        </Text>
        <TextField
          onChangeText={updateState("firstName")}
          placeholder="First name"
          label="First name"
          containerStyle={$inputContainer}
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
          containerStyle={$inputContainer}
        />
        <TextField
          placeholder="Email"
          label="Email"
          containerStyle={$inputContainer}
          value={driverState.email}
          onChangeText={(email) => setDriverState((v) => ({ ...v, email }))}
        />
        <Text preset="formLabel" style={[$formLabel, $inputContainer]}>
          Address
        </Text>
        <Pressable
          onPress={() => addressSearch.current?.open()}
          style={[$input, { paddingVertical: spacing.xs }]}
        >
          <Text
            style={
              !driverState.location.address
                ? { color: colors.textDim }
                : undefined
            }
          >
            {driverState.location.address || "Search Address"}
          </Text>
        </Pressable>
        <PhoneNumberInput
          ref={phoneNumberInput}
          onChangeText={updateState("phoneNumber")}
          onChangeCallingCode={(callingCode, callingCountry) => {
            setDriverState((s) => ({ ...s, callingCode, callingCountry }));
          }}
          placeholder="Phone number"
          label="Phone number"
          value={driverState.phoneNumber}
          containerStyle={$inputContainer}
          callingCountry={driverState.callingCountry}
        />
        <DriversLicenseUpload
          frontImage={driverState.driversLicenseFront}
          backImage={driverState.driversLicenseBack}
          onFrontImageUploaded={updateState("driversLicenseFront")}
          onBackImageUploaded={updateState("driversLicenseBack")}
          style={$inputContainer}
          driverId={driverState.id}
        />

        {driver?.registration && (
          <View style={[$borderedArea, { marginTop: spacing.lg }]}>
            <View style={[$row, { marginBottom: spacing.xxs }]}>
              <Text preset="subheading">Registration Status</Text>
              <StatusIndicator
                status={driver.registration.status}
                style={{ marginLeft: spacing.sm }}
              />
            </View>
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

        <Button
          preset={fieldsComplete ? "filled" : "default"}
          style={$button}
          text={driver ? "Edit driver profile" : "Continue"}
          onPress={handleCreateDriver}
          RightAccessory={Loading}
        />
      </Card>

      {/* <LogoutButton style={{ alignSelf: "center", marginTop: spacing.md }} /> */}

      <AddressSearchModal
        ref={addressSearch}
        onLocationSelected={(location) => {
          addressSearch.current?.close();
          setDriverState((s) => ({
            ...s,
            location: {
              address: location.address,
              latitude: location.latitude,
              longitude: location.longitude,
              geohash: location.geohash,
            },
          }));
        }}
        shortenAddress={false}
      />
    </Screen>
  );
};

const $screen = { padding: spacing.md, flexGrow: 1 };
const $header: TextStyle = { marginBottom: spacing.lg, alignSelf: "center" };
const $inputContainer: ViewStyle = { marginTop: spacing.sm };
const $button = { marginTop: spacing.lg };
