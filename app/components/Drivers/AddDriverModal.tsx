import React, { forwardRef, useMemo, useState } from "react";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native";
import { colors, spacing } from "app/theme";
import { TextField } from "../TextField";
import { Text } from "../Text";
import { Button } from "../Button";
import { useAppSelector } from "app/redux/store";
import { shallowEqual } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import { useAlert } from "app/hooks";
import functions from "@react-native-firebase/functions";
import { Vendor } from "delivfree";
import { Icon } from "../Icon";

interface Props {
  onClose: () => void;
}

const AddDriver = ({ onClose }: Props) => {
  const Alert = useAlert();

  const { userType, driver, vendor } = useAppSelector(
    (state) => ({
      userType: state.appConfig.userType,
      driver: state.driver.activeDriver,
      vendor: state.vendor.activeVendor as Vendor,
    }),
    shallowEqual
  );

  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const addDriver = async () => {
    try {
      if (!code) {
        return;
      }
      setAddLoading(true);
      const driverCodeSnap = await firestore()
        .collection("DriverCodes")
        .where("code", "==", code)
        .get();

      const driverCodeDoc = driverCodeSnap.docs[0];

      if (!driverCodeDoc) {
        Alert.alert(
          "Invalid Code",
          "We could not find a driver with that code. Please try again."
        );
      } else {
        const driverId = driverCodeDoc.id;

        await functions().httpsCallable("addDriver")({
          vendor: vendor.id,
          driver: driverId,
          parentDriver: userType === "driver" ? driver?.id : undefined,
        });

        setSuccess(true);
      }
      setAddLoading(false);
    } catch (error) {
      setAddLoading(false);
      console.log("Failed to add driver", error);
      Alert.alert("Something went wrong", "Please try that again.");
    }
  };

  const AddDriverLoading = useMemo(
    () =>
      addLoading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [addLoading]
  );

  if (success) {
    return (
      <View style={[$content, { alignItems: "center" }]}>
        <Icon icon="check-circle" color={colors.primary} size={60} />
        <Text preset="subheading" style={{ marginTop: spacing.xs }}>
          Driver added successfully!
        </Text>
        <Button
          style={{ marginTop: spacing.md, alignSelf: "stretch" }}
          text="Close"
          preset="filled"
          onPress={onClose}
        />
      </View>
    );
  }

  return (
    <View style={$content}>
      <Text preset="subheading">Add Driver</Text>
      <Text style={$message}>
        Ask your driver for their Driver Code and enter it here to link them to
        your company.
      </Text>
      <TextField
        placeholder="Driver code"
        label="Driver code"
        containerStyle={$input}
        onChangeText={setCode}
      />
      <Button
        text="Add Driver"
        preset={code ? "filled" : "default"}
        style={$button}
        RightAccessory={AddDriverLoading}
        onPress={addDriver}
      />
    </View>
  );
};

export const AddDriverModal = forwardRef<ModalRef, Props>(
  function AddDriverModal(props, ref) {
    return (
      <ReanimatedCenterModal ref={ref}>
        <AddDriver {...props} />
      </ReanimatedCenterModal>
    );
  }
);

const $content: ViewStyle = {
  padding: spacing.md,
};
const $message: TextStyle = { marginTop: spacing.sm };
const $input: ViewStyle = { marginTop: spacing.sm };
const $button: ViewStyle = { marginTop: spacing.lg };
