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
import { TextInput } from "../TextInput";
import { Customer, Vendor } from "functions/src/types";
import { useAlert, useDebounce } from "app/hooks";
import firestore from "@react-native-firebase/firestore";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { ButtonSmall } from "../ButtonSmall";
import { Text } from "../Text";
import { $shadow } from "../styles";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import { Button } from "../Button";
import { generateUid } from "app/utils/general";
import { useAppSelector } from "app/redux/store";
import { TextField } from "../TextField";
import { AddressSearchModal } from "../AddressSearchModal";
import { AddressSearchField } from "../AddressSearchField";
import { PhoneNumberInput } from "../PhoneNumberInput";

interface Props {
  onCustomerSelect: (customer: Customer) => void;
  style?: ViewStyle;
  initialPhoneNumber?: string;
  validation?: (val: string) => boolean;
  restaurantLocation: string;
}

export const CustomerSearchInput = ({
  initialPhoneNumber,
  onCustomerSelect,
  style,
  validation,
  restaurantLocation,
}: Props) => {
  const Alert = useAlert();
  const addressSearchModal = useRef<ModalRef>(null);

  const [containerHeight, setContainerHeight] = useState(0);
  const onLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) => {
    setContainerHeight(height);
  };

  const addCustomerModal = useRef<ModalRef>(null);

  const vendor = useAppSelector((state) => state.vendor.data);

  const [{ customers, loading, phoneNumber, searching }, setState] = useState<{
    customers: Customer[];
    loading: boolean;
    phoneNumber: string;
    searching: boolean;
  }>({
    customers: [],
    loading: false,
    phoneNumber: initialPhoneNumber || "",
    searching: !initialPhoneNumber,
  });

  const [addCustomerLoading, setAddCustomerLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: generateUid(),
    name: "",
    location: { address: "", latitude: 0, longitude: 0, geohash: "" },
    callingCode: "+1",
    phoneNumber: "",
    vendor: vendor?.id || "",
    restaurantLocation,
  });
  const newCustomerComplete =
    newCustomer.location.address && newCustomer.phoneNumber && newCustomer.name;

  const onChangeText = async (phoneNumber: string) => {
    setState({ phoneNumber, loading: true, customers: [], searching: true });
    const customerSnapshot = await firestore()
      .collection("Customers")
      .where("restaurantLocation", "==", restaurantLocation)
      .where("phoneNumber", ">=", phoneNumber)
      .where("phoneNumber", "<", phoneNumber + "\uf8ff")
      .get();
    const customers = customerSnapshot.docs.map(
      (doc) => doc.data() as Customer
    );
    setState({ phoneNumber, loading: false, customers, searching: true });
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
        phoneNumber: newCustomer.phoneNumber,
        loading: false,
        customers,
        searching: false,
      });
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
      <TextField
        label="Customer phone number"
        placeholder="Customer phone number"
        onChangeText={onChangeText}
        value={phoneNumber}
        validation={validation}
      />
      {!!phoneNumber && searching && (
        <View style={[$customerPanel, { top: containerHeight + spacing.sm }]}>
          {loading && <ActivityIndicator />}
          {customers.length ? (
            customers.map((customer, index) => {
              return (
                <Pressable
                  key={`${customer.phoneNumber}-${index}`}
                  onPress={() => {
                    setState({
                      phoneNumber: customer.phoneNumber,
                      loading: false,
                      customers,
                      searching: false,
                    });
                    onCustomerSelect(customer);
                  }}
                >
                  <Text>{customer.name}</Text>
                  <Text size={"xs"} style={{ color: colors.textDim }}>
                    {customer.location.address}
                  </Text>
                </Pressable>
              );
            })
          ) : !loading ? (
            <Text style={{ marginBottom: spacing.xs }}>No customers found</Text>
          ) : null}
          {!loading && !customers.length && (
            <ButtonSmall
              text="Add Customer"
              onPress={() => {
                setNewCustomer((c) => ({ ...c, phoneNumber }));
                addCustomerModal.current?.open();
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
            onChangeCallingCode={(callingCode) => {
              setNewCustomer((c) => ({ ...c, callingCode }));
            }}
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
const $modalContent: ViewStyle = {
  backgroundColor: colors.background,
  padding: spacing.md,
};
const $input: ViewStyle = { marginTop: spacing.sm };
const $addCustomerButton: ViewStyle = { marginTop: spacing.md };
