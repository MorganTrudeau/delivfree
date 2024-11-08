import { createUser, updateUser } from "app/apis/user";
import { Button, Icon, Screen, Text, TextField, Toggle } from "app/components";
import { AddressSearchModal } from "app/components/AddressSearchModal";
import { Card } from "app/components/Card";
import { DriversLicenseUpload } from "app/components/DriversLicenseUpload";
import { ModalRef } from "app/utils/types";
import { PhoneNumberInput } from "app/components/PhoneNumberInput";
import { StatusIndicator } from "app/components/StatusIndicator";
import {
  $borderedArea,
  $flex,
  $flexShrink,
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
import { BottomSheet, BottomSheetRef } from "app/components/Modal/BottomSheet";
import { TermsAndConditionsDriver } from "app/components/TermsAndConditionsDriver";
import { FileUpload } from "app/components/FileUpload";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const EditDriverProfileScreen = () => {
  const Alert = useAlert();
  const Toast = useToast();
  const insets = useSafeAreaInsets();

  const termsModal = useRef<BottomSheetRef>(null);
  const lastNameInput = useRef<RNInput>(null);
  const phoneNumberInput = useRef<PhoneInput>(null);
  const addressSearch = useRef<ModalRef>(null);

  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const user = useAppSelector((state) => state.user.user);
  const driver = useAppSelector((state) => state.driver.activeDriver);

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      criminalRecordCheck: "",
      referralCode: "",
    }
  );

  const updateState = (key: keyof Driver) => (val: string) => {
    setDriverState((s) => ({ ...s, [key]: val }));
  };

  const fieldsComplete =
    driverState.location.address &&
    driverState.location.geohash &&
    driverState.firstName &&
    driverState.lastName &&
    driverState.phoneNumber &&
    driverState.email &&
    driverState.driversLicenseFront &&
    driverState.driversLicenseBack &&
    termsAccepted;

  const handleCreateDriver = useCallback(async () => {
    if (!termsAccepted) {
      return Alert.alert(
        "Terms and conditions",
        "Please review and accept the terms and conditions."
      );
    }
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
  }, [driverState, authToken, dispatch, Alert, termsAccepted]);

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator color={"#fff"} style={style} />
        : undefined,
    [loading]
  );

  return (
    <Screen
      preset={"scroll"}
      contentContainerStyle={[
        $screen,
        { paddingBottom: spacing.md + insets.bottom },
      ]}
    >
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
        <Pressable onPress={() => addressSearch.current?.open()} style={$input}>
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
          userId={authToken}
        />
        <View style={$inputContainer}>
          <Text preset="formLabel" style={$formLabel}>
            Criminal record check document
          </Text>
          <FileUpload
            label={
              driverState.criminalRecordCheck ? "File uploaded" : "Upload file"
            }
            onFileUploaded={(criminalRecordCheck) =>
              setDriverState((d) => ({ ...d, criminalRecordCheck }))
            }
            fileDest={`CriminalRecordChecks/${authToken}`}
            fileMetadata={{ user: authToken }}
          />
        </View>

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

        <View style={[$row, { paddingVertical: spacing.md }]}>
          <Toggle
            value={termsAccepted}
            onValueChange={() => {
              setTermsAccepted((s) => !s);
            }}
          />
          <Text style={[$flexShrink, { marginLeft: spacing.xs }]}>
            I agree to the DelivFree Canada Inc driver{" "}
            <Text
              onPress={() => termsModal.current?.snapToIndex(0)}
              style={{ color: colors.primary }}
            >
              Terms and Conditions
            </Text>
          </Text>
        </View>

        <BottomSheet ref={termsModal}>
          <BottomSheetScrollView style={{ padding: spacing.md }}>
            <TermsAndConditionsDriver />
          </BottomSheetScrollView>
        </BottomSheet>

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
