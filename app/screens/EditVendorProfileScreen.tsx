import { createUser, updateUser } from "app/apis/user";
import { Button, Icon, Screen, Text, TextField } from "app/components";
import { Card } from "app/components/Card";
import { DetailItem } from "app/components/DetailItem";
import { DetailsHeader } from "app/components/Details/DetailsHeader";
import { PhoneNumberInput } from "app/components/PhoneNumberInput";
import { StatusIndicator } from "app/components/StatusIndicator";
import { TextInput } from "app/components/TextInput";
import { ManageVendorLocationModal } from "app/components/VendorLocation/ManageVendorLocation";
import { VendorLocationsList } from "app/components/VendorLocations/VendorLocationsList";
import { $borderedArea, $row } from "app/components/styles";
import { useAlert, useToast } from "app/hooks";
import { FirebaseUser } from "app/redux/reducers/auth";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { createVendor } from "app/redux/thunks/vendor";
import { listenToVendorLocations } from "app/redux/thunks/vendorLocations";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { generateUid } from "app/utils/general";
import { ModalRef, Status, User, Vendor, VendorLocation } from "delivfree";
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
  const Toast = useToast();

  const lastNameInput = useRef<RNInput>(null);
  const businessNameInput = useRef<RNInput>(null);
  const phoneNumberInput = useRef<RNInput>(null);
  const vendorLocationModal = useRef<ModalRef>(null);

  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user as FirebaseUser);
  const user = useAppSelector((state) => state.user.user);
  const vendor = useAppSelector((state) => state.vendor.activeVendor);
  const vendorLocationsData = useAppSelector(
    (state) => state.vendorLocations.data
  );
  const vendorLocations = useMemo(
    () => Object.values(vendorLocationsData),
    [vendorLocationsData]
  );

  const [loading, setLoading] = useState(false);
  const [editLocation, setEditLocation] = useState<VendorLocation>();

  const [editing, setEditing] = useState(!vendor);
  const [vendorState, setVendorState] = useState<Vendor>(
    vendor || {
      id: generateUid(),
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      businessName: "",
      callingCode: "+1",
      callingCountry: "CA",
      phoneNumber: "",
      registration: { status: "pending", message: null },
      email: authUser?.email || user?.email || "",
      users: [authUser.uid],
      updated: Date.now(),
      pendingLocations: [],
      pendingPositions: [],
    }
  );

  const fieldsComplete = useMemo(
    () => Object.values(vendorState).every((v) => !!v),
    [vendorState]
  );

  const openVendorLocationModal = useCallback(() => {
    vendorLocationModal.current?.open();
  }, []);
  const closeVendorLocationModal = useCallback(() => {
    vendorLocationModal.current?.close();
  }, []);

  const addLocation = () => {
    openVendorLocationModal();
  };

  const handleVendorLocationPress = (vendorLocation: VendorLocation) => {
    setEditLocation(vendorLocation);
    vendorLocationModal.current?.open();
  };

  const handleCreateVendor = async () => {
    if (!fieldsComplete) {
      return Alert.alert(
        "Missing fields",
        "Please fill out all fields before continuing."
      );
    }
    const newUser = {
      id: authUser?.uid,
      firstName: vendorState.firstName,
      lastName: vendorState.lastName,
      email: vendorState.email,
      vendor: { ids: [vendorState.id] },
    };

    try {
      setLoading(true);
      if (user) {
        await dispatch(createVendor(vendorState));
        await updateUser(newUser.id, { vendor: { ids: [vendorState.id] } });
      } else {
        await dispatch(createVendor(vendorState));
        await dispatch(createUser({ ...newUser, location: null }));
      }
      setEditing(false);
      Toast.show("Vendor profile sent for review");
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
        {editing ? (
          <>
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
              placeholder="Email"
              label="Email"
              containerStyle={$input}
              value={vendorState.email}
              onChangeText={(email) => setVendorState((v) => ({ ...v, email }))}
            />
            <PhoneNumberInput
              placeholder="Phone number"
              label="Phone number"
              containerStyle={$input}
              value={vendorState.phoneNumber}
              onChangeText={(phoneNumber) =>
                setVendorState((v) => ({ ...v, phoneNumber }))
              }
              onChangeCallingCode={(callingCode, callingCountry) => {
                setVendorState((v) => ({ ...v, callingCode, callingCountry }));
              }}
              callingCountry={vendorState.callingCountry}
            />
            <Button
              preset={fieldsComplete ? "filled" : "default"}
              style={$button}
              text={vendor ? "Edit vendor profile" : "Continue"}
              onPress={handleCreateVendor}
              RightAccessory={Loading}
            />
          </>
        ) : (
          <>
            <DetailsHeader
              title={"Details"}
              actionIcon={"pencil"}
              onAction={() => setEditing(true)}
            />
            <DetailItem
              title="Business name"
              value={vendorState.businessName}
            />
            <DetailItem title="First name" value={vendorState.firstName} />
            <DetailItem title="Last name" value={vendorState.lastName} />
            <DetailItem
              title="Phone number"
              value={vendorState.callingCode + " " + vendorState.phoneNumber}
            />
          </>
        )}

        {vendor && (
          <>
            <DetailsHeader
              title={"Add your locations"}
              style={$detailHeaderStyle}
              onAction={addLocation}
              actionIcon="plus"
            />
            <VendorLocationsList
              locations={vendorLocations}
              headerStyle={$listHeaderStyle}
              style={{ flexGrow: 0 }}
              onPress={handleVendorLocationPress}
            />
          </>
        )}

        {vendor?.registration && (
          <View style={[$borderedArea, { marginTop: spacing.xl }]}>
            <View style={[$row, { marginBottom: spacing.xxs }]}>
              <Text preset="subheading">Registration Status</Text>
              <StatusIndicator
                status={vendor.registration.status}
                style={{ marginLeft: spacing.sm }}
              />
            </View>
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
                Please wait while we review your registration submission. This
                will take 5-7 business days.
              </Text>
            )}
          </View>
        )}
      </Card>

      <ManageVendorLocationModal
        vendor={vendorState.id}
        ref={vendorLocationModal}
        onClose={closeVendorLocationModal}
        editLocation={editLocation}
        onDismiss={() => setEditLocation(undefined)}
      />
    </Screen>
  );
};

const $screen = { padding: spacing.md };
const $header: TextStyle = { marginBottom: spacing.lg, alignSelf: "center" };
const $button = { marginTop: spacing.lg };
const $input: ViewStyle = { marginTop: spacing.sm };
const $detailHeaderStyle: ViewStyle = { marginTop: spacing.lg };
const $listHeaderStyle: ViewStyle = { borderTopWidth: 0 };

const requiredValidation = (val: string) => !!val;
