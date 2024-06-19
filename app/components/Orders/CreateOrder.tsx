import React, { forwardRef, useMemo, useRef, useState } from "react";
import { Customer, Order } from "delivfree";
import { generateUid, localizeCurrency } from "app/utils/general";
import moment from "moment";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import {
  View,
  ViewStyle,
  TextInput as RNTextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { CustomerSearchInput } from "../Customers/CustomerSearchInput";
import { useAppSelector } from "app/redux/store";
import { Button } from "../Button";
import firestore from "@react-native-firebase/firestore";
import { TextField } from "../TextField";
import { $formLabel, $row } from "../styles";
import { useAlert } from "app/hooks";
import { shallowEqual } from "react-redux";
import { DropDownPicker } from "../DropDownPicker";
import { createOrder } from "app/apis/orders";

interface CreateOrderProps {
  onClose: () => void;
  editOrder?: Order;
  vendorLocationId: string;
}

export const CreateOrder = ({
  onClose,
  editOrder,
  vendorLocationId,
}: CreateOrderProps) => {
  const Alert = useAlert();

  const amountInput = useRef<RNTextInput>(null);
  const tipInput = useRef<RNTextInput>(null);

  const { customers, vendorId, drivers } = useAppSelector(
    (state) => ({
      customers: state.customers.data,
      vendorId: state.vendor.activeVendor?.id as string,
      drivers: state.vendorDrivers.data,
    }),
    shallowEqual
  );

  const driverDropdownItems = useMemo(
    () =>
      Object.values(drivers)
        .filter((d) => d.vendorLocations?.includes(vendorLocationId))
        .map((d) => ({ value: d.id, label: d.firstName + " " + d.lastName })),
    [drivers, vendorLocationId]
  );

  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [order, setOrder] = useState<Order>(
    editOrder || {
      id: generateUid(),
      total: "",
      subtotal: "",
      tax: "",
      tip: "",
      customer: "",
      date: moment().valueOf(),
      status: "in-progress",
      vendor: vendorId,
      vendorLocation: vendorLocationId,
      driver: null,
      currency: "CAD",
      checkoutItems: [],
      deliveryInstructions: { type: "meet-door", note: "" },
    }
  );

  const orderComplete = order.total && order.tip && order.customer;

  const customer: Customer | undefined = customers[order.customer];

  const formatOrder = () => {
    setOrder((o) => ({
      ...o,
      amount: localizeCurrency(Number(o.total), "USD"),
    }));
  };

  const formatTip = () => {
    setOrder((o) => ({
      ...o,
      tip: localizeCurrency(Number(o.tip), "USD"),
    }));
  };

  const handleCreateOrder = async () => {
    try {
      if (!order.customer) {
        return Alert.alert("Missing Customer", "Please select a customer");
      }
      if (!order.total) {
        return Alert.alert("Missing Amount", "Please enter an amount");
      }
      setCreateLoading(true);
      await createOrder(order);
      setCreateLoading(false);
      onClose();
    } catch (error) {
      setCreateLoading(false);
      console.log("Create order order", error);
    }
  };

  const deleteOrder = async () => {
    try {
      const shouldContinue = await new Promise((resolve) => {
        Alert.alert(
          "Delete Order",
          "Are you sure you want to delete this order?",
          [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "Delete", onPress: () => resolve(true) },
          ]
        );
      });
      if (!shouldContinue) {
        return;
      }
      setDeleteLoading(true);
      await firestore().collection("Orders").doc(order.id).delete();
      setDeleteLoading(false);
      onClose();
    } catch (error) {
      setDeleteLoading(false);
      console.log("Delete order order", error);
    }
  };

  const CreateLoading = useMemo(
    () =>
      createLoading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [createLoading]
  );

  return (
    <View style={$content}>
      <View style={$row}>
        <Text preset="subheading" style={{ flex: 1 }}>
          Create Order
        </Text>
        {editOrder && (
          <View style={$row}>
            <Pressable onPress={deleteOrder}>
              <Text style={{ color: colors.error }}>Delete</Text>
            </Pressable>
            {deleteLoading && (
              <ActivityIndicator
                color={colors.error}
                style={{ marginLeft: spacing.xs }}
              />
            )}
          </View>
        )}
      </View>
      {!!customer && (
        <View style={{ marginTop: spacing.sm }}>
          <Text size={"xs"}>Customer</Text>
          <Text preset="semibold">{customer.name}</Text>
        </View>
      )}
      <CustomerSearchInput
        onCustomerSelect={(customer) =>
          setOrder((o) => ({ ...o, customer: customer.id }))
        }
        initialPhoneNumber={customer?.phoneNumber}
        style={$input}
        vendorLocation={vendorLocationId}
      />
      <TextField
        label="Order amount"
        placeholder="Order amount"
        containerStyle={$input}
        onBlur={formatOrder}
        value={order.total}
        onChangeText={(amount) => setOrder((o) => ({ ...o, amount }))}
        ref={amountInput}
        onSubmitEditing={() => tipInput.current?.focus()}
        onFocus={() => {
          let strippedValue = order.total.replace(/[$,]/g, "");
          if (!Number(strippedValue)) {
            strippedValue = "";
          }
          setOrder((o) => ({ ...o, amount: strippedValue }));
        }}
        numberInput
        validation={requiredInputValidation}
      />
      <TextField
        label="Tip amount"
        placeholder="Tip amount"
        containerStyle={$input}
        onBlur={formatTip}
        value={order.tip}
        onChangeText={(tip) => setOrder((o) => ({ ...o, tip }))}
        onFocus={() => {
          let strippedValue = order.tip.replace(/[$,]/g, "");
          if (!Number(strippedValue)) {
            strippedValue = "";
          }
          setOrder((o) => ({ ...o, tip: strippedValue }));
        }}
        ref={tipInput}
        numberInput
      />
      {!!driverDropdownItems.length && (
        <>
          <Text
            preset="formLabel"
            style={[$formLabel, { marginTop: spacing.sm }]}
          >
            Driver
          </Text>
          <DropDownPicker
            items={driverDropdownItems}
            onSelect={(values) =>
              setOrder((o) => ({ ...o, driver: values[0] }))
            }
            selectedValues={order.driver ? [order.driver] : undefined}
            placeholder={"Select driver (optional)"}
            singleSelect
          />
        </>
      )}

      <Button
        onPress={handleCreateOrder}
        text={editOrder ? "Update Order" : "Create Order"}
        style={$button}
        preset={orderComplete ? "filled" : "default"}
        RightAccessory={CreateLoading}
      />
    </View>
  );
};

interface CreateOrderModalProps extends CreateOrderProps {
  onDismiss?: () => void;
}

export const CreateOrderModal = forwardRef<ModalRef, CreateOrderModalProps>(
  ({ onDismiss, ...rest }, ref) => {
    return (
      <ReanimatedCenterModal ref={ref} onDismiss={onDismiss}>
        <CreateOrder {...rest} />
      </ReanimatedCenterModal>
    );
  }
);

const requiredInputValidation = (val: string) => !!val;

const $content: ViewStyle = {
  padding: spacing.md,
};

const $input: ViewStyle = {
  marginTop: spacing.sm,
};

const $button: ViewStyle = {
  marginTop: spacing.md,
};
