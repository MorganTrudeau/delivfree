import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { CountryCode, Customer } from "delivfree";
import { useAlert } from "app/hooks";
import firestore from "@react-native-firebase/firestore";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { ButtonSmall } from "../ButtonSmall";
import { Text } from "../Text";
import { $shadow } from "../styles";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { ModalRef } from "app/utils/types";
import { Button } from "../Button";
import { generateUid } from "app/utils/general";
import { useAppSelector } from "app/redux/store";
import { TextField } from "../TextField";
import { AddressSearchField } from "../AddressSearchField";
import { PhoneNumberInput } from "../PhoneNumberInput";
import PhoneInput from "react-native-phone-number-input";

interface Props {
  onCustomerSelect: (customer: Customer) => void;
  style?: ViewStyle;
  initialPhoneNumber?: string;
  vendorLocation: string;
}

export const CustomerSearchInput = ({
  initialPhoneNumber,
  onCustomerSelect,
  style,
  vendorLocation,
}: Props) => {
  const Alert = useAlert();
  const phoneNumberInput = useRef<PhoneInput>(null);

  const [containerHeight, setContainerHeight] = useState(0);
  const onLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) => {
    setContainerHeight(height);
  };

  const addCustomerModal = useRef<ModalRef>(null);

  const vendor = useAppSelector((state) => state.vendor.activeVendor);

  const [
    { customers, loading, callingCountry, callingCode, phoneNumber, searching },
    setState,
  ] = useState<{
    customers: Customer[];
    loading: boolean;
    callingCountry: CountryCode;
    callingCode: string;
    phoneNumber: string;
    searching: boolean;
  }>({
    customers: [],
    loading: false,
    callingCountry: "CA",
    callingCode: "+1",
    phoneNumber: initialPhoneNumber || "",
    searching: !initialPhoneNumber,
  });

  const [addCustomerLoading, setAddCustomerLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: generateUid(),
    name: "",
    location: { address: "", latitude: 0, longitude: 0, geohash: "" },
    callingCountry: "CA",
    callingCode: "+1",
    phoneNumber: "",
    vendor: vendor?.id || "",
    vendorLocation,
  });
  const newCustomerComplete =
    newCustomer.location.address && newCustomer.phoneNumber && newCustomer.name;

  const onChangeText = async (phoneNumber: string) => {
    setState((s) => ({
      ...s,
      phoneNumber,
      loading: true,
      customers: [],
      searching: true,
    }));
    const customerSnapshot = await firestore()
      .collection("Customers")
      .where("vendorLocation", "==", vendorLocation)
      .where("phoneNumber", ">=", phoneNumber)
      .where("phoneNumber", "<", phoneNumber + "\uf8ff")
      .get();
    const customers = customerSnapshot.docs.map(
      (doc) => doc.data() as Customer
    );
    setState((s) => ({
      ...s,
      phoneNumber,
      loading: false,
      customers,
      searching: true,
    }));
  };

  const handleAddCustomer = async () => {
    try {
      if (!newCustomerComplete) {
        return Alert.alert(
          "Missing Fields",
          "Please fill out the required fields."
        );
      }
      setAddCustomerLoading(true);
      await firestore()
        .collection("Customers")
        .doc(newCustomer.id)
        .set(newCustomer);
      onCustomerSelect(newCustomer);
      addCustomerModal.current?.close();
      setAddCustomerLoading(false);
      setState({
        callingCode: newCustomer.callingCode,
        phoneNumber: newCustomer.phoneNumber,
        callingCountry: newCustomer.callingCountry,
        loading: false,
        customers,
        searching: false,
      });
      phoneNumberInput.current?.setValue(newCustomer.phoneNumber);
    } catch (error) {
      setAddCustomerLoading(false);
      Alert.alert(
        "Something went wrong",
        "Failed to add customer. Please try again."
      );
    }
  };

  const AddCustomerLoading = useMemo(
    () =>
      addCustomerLoading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [addCustomerLoading]
  );

  return (
    <View style={[$container, style]} onLayout={onLayout}>
      <PhoneNumberInput
        ref={phoneNumberInput}
        label="Customer phone number"
        placeholder="Customer phone number"
        onChangeText={onChangeText}
        onChangeCallingCode={(callingCode, callingCountry) => {
          setState((s) => ({ ...s, callingCode, callingCountry }));
        }}
        value={phoneNumber}
        callingCountry={callingCountry}
      />
      {!!phoneNumber && searching && (
        <View style={[$customerPanel, { top: containerHeight + spacing.sm }]}>
          {loading && <ActivityIndicator />}
          {customers.length ? (
            customers.map((customer, index, arr) => {
              return (
                <>
                  <Pressable
                    key={`${customer.phoneNumber}-${index}`}
                    onPress={() => {
                      setState({
                        callingCode: customer.callingCode,
                        phoneNumber: customer.phoneNumber,
                        callingCountry: customer.callingCountry,
                        loading: false,
                        customers,
                        searching: false,
                      });
                      phoneNumberInput.current?.setValue(customer.phoneNumber);
                      onCustomerSelect(customer);
                    }}
                  >
                    <Text>{customer.name}</Text>
                    <Text size={"xs"} style={{ color: colors.textDim }}>
                      {customer.location.address}
                    </Text>
                  </Pressable>
                  {index !== arr.length - 1 && (
                    <View
                      style={$separator}
                      key={`separator-${customer.phoneNumber}-${index}`}
                    />
                  )}
                </>
              );
            })
          ) : !loading ? (
            <Text style={{ marginBottom: spacing.xs }}>No customers found</Text>
          ) : null}
          {!loading && !customers.length && (
            <ButtonSmall
              text="Add Customer"
              onPress={() => {
                setNewCustomer((c) => ({
                  ...c,
                  callingCode,
                  callingCountry,
                  phoneNumber,
                }));
                setTimeout(() => {
                  addCustomerModal.current?.open();
                }, 200);
              }}
            />
          )}
        </View>
      )}
      <ReanimatedCenterModal ref={addCustomerModal}>
        <View style={$modalContent}>
          <Text preset="subheading">Add customer</Text>
          <PhoneNumberInput
            placeholder="Phone number"
            label="Phone number"
            value={newCustomer.phoneNumber}
            containerStyle={$input}
            onChangeText={(phoneNumber) =>
              setNewCustomer((c) => ({ ...c, phoneNumber }))
            }
            onChangeCallingCode={(callingCode, callingCountry) => {
              setNewCustomer((c) => ({ ...c, callingCode, callingCountry }));
            }}
            callingCountry={newCustomer.callingCountry}
          />
          <TextField
            placeholder="Name"
            label="Name"
            containerStyle={$input}
            value={newCustomer.name}
            onChangeText={(name) => setNewCustomer((c) => ({ ...c, name }))}
          />
          <AddressSearchField
            location={newCustomer.location}
            onLocationSelect={(location) =>
              setNewCustomer((c) => ({ ...c, location }))
            }
          />
          <Button
            text={"Add customer"}
            onPress={handleAddCustomer}
            style={$addCustomerButton}
            preset={newCustomerComplete ? "filled" : "default"}
            RightAccessory={AddCustomerLoading}
          />
        </View>
      </ReanimatedCenterModal>
    </View>
  );
};

const $container: ViewStyle = { zIndex: 999 };
const $customerPanel: StyleProp<ViewStyle> = [
  {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    position: "absolute",
    top: 45,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    zIndex: 999,
  },
  $shadow,
];
const $separator: ViewStyle = { height: spacing.sm };
const $modalContent: ViewStyle = {
  backgroundColor: colors.background,
  padding: spacing.md,
};
const $input: ViewStyle = { marginTop: spacing.sm };
const $addCustomerButton: ViewStyle = { marginTop: spacing.md };
