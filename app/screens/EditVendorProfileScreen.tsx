import { createUser, updateUser } from "app/apis/user";
import { Button, Icon, Screen, Text, TextField } from "app/components";
import { Card } from "app/components/Card";
import { TextInput } from "app/components/TextInput";
import { $borderedArea, $row } from "app/components/styles";
import { useAlert } from "app/hooks";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { createVendor } from "app/redux/thunks/vendor";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { generateUid } from "app/utils/general";
import { User, Vendor } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextStyle,
  ViewStyle,
  TextInput as RNInput,
  View,
} from "react-native";

export const EditVendorProfileScreen = () => {
  const Alert = useAlert();

  const lastNameInput = useRef<RNInput>(null);
  const businessNameInput = useRef<RNInput>(null);
  const phoneNumberInput = useRef<RNInput>(null);

  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const user = useAppSelector((state) => state.user.user);
  const vendor = useAppSelector((state) => state.vendor.data);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [vendorState, setVendorState] = useState<Vendor>({
    id: vendor?.id || generateUid(),
    firstName: vendor?.firstName || user?.firstName || "",
    lastName: vendor?.lastName || user?.lastName || "",
    businessName: vendor?.businessName || "",
    phoneNumber: vendor?.phoneNumber || "",
    registration: { status: "pending" },
  });

  const fieldsComplete = useMemo(
    () => Object.values(vendorState).every((v) => !!v),
    [vendorState]
  );

  const handleCreateVendor = async () => {
    if (!fieldsComplete) {
      return Alert.alert(
        "Missing fields",
        "Please fill out all fields before continuing."
      );
    }
    const newUser = {
      id: authToken,
      firstName: vendorState.firstName,
      lastName: vendorState.lastName,
      vendor: { ids: [vendorState.id] },
    };

    try {
      setLoading(true);
      if (user) {
        await updateUser(newUser.id, { vendor: { ids: [vendorState.id] } });
        await dispatch(createVendor(vendorState));
      } else {
        await dispatch(createUser({ ...newUser, location: null }));
        await dispatch(createVendor(vendorState));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Something went wrong", "Please try that again.");
    }
  };

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
          Vendor profile
        </Text>
        <TextField
          placeholder="First name"
          label="First name"
          validation={requiredValidation}
          onChangeText={(firstName) =>
            setVendorState((v) => ({ ...v, firstName }))
          }
          containerStyle={$input}
          value={vendorState.firstName}
          onSubmitEditing={() => lastNameInput.current?.focus()}
        />
        <TextField
          placeholder="Last name"
          label="Last name"
          onChangeText={(lastName) =>
            setVendorState((v) => ({ ...v, lastName }))
          }
          containerStyle={$input}
          ref={lastNameInput}
          value={vendorState.lastName}
          onSubmitEditing={() => businessNameInput.current?.focus()}
        />
        <TextField
          placeholder="Business name"
          label="Business name"
          onChangeText={(businessName) =>
            setVendorState((v) => ({ ...v, businessName }))
          }
          containerStyle={$input}
          ref={businessNameInput}
          value={vendorState.businessName}
          onSubmitEditing={() => phoneNumberInput.current?.focus()}
        />
        <TextField
          placeholder="Phone number"
          label="Phone number"
          onChangeText={(phoneNumber) =>
            setVendorState((v) => ({ ...v, phoneNumber }))
          }
          containerStyle={$input}
          ref={phoneNumberInput}
          value={vendorState.phoneNumber}
        />
        {!vendor?.registration ? (
          <Button
            preset={fieldsComplete ? "filled" : "default"}
            style={$button}
            text={"Continue"}
            onPress={handleCreateVendor}
            RightAccessory={Loading}
          />
        ) : (
          <View style={[$borderedArea, { marginTop: spacing.lg }]}>
            <Text>
              <Text preset="subheading">Registration Status: </Text>
              <Text size="lg">
                {getRegistrationStatusText(vendor.registration.status)}
              </Text>
            </Text>
            {!!vendor.registration.message ? (
              <View style={$row}>
                <Icon
                  icon="information"
                  color={colors.error}
                  size={sizing.md}
                />
                <Text style={{ marginLeft: spacing.xs }}>
                  {vendor.registration.message}
                </Text>
              </View>
            ) : (
              <Text>
                Please wait while we review your registration submission.
              </Text>
            )}
          </View>
        )}
      </Card>
    </Screen>
  );
};

const getRegistrationStatusText = (
  status: Vendor["registration"]["status"]
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
const $button = { marginTop: spacing.lg };
const $input: ViewStyle = { marginTop: spacing.sm };

const requiredValidation = (val: string) => !!val;
