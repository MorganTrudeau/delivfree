import { updateVendor } from "app/apis/vendors";
import { Button, Screen, TextField } from "app/components";
import { PhoneNumberInput } from "app/components/PhoneNumberInput";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { useAlert, useToast } from "app/hooks";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { isValidEmail } from "app/utils/general";
import { Vendor } from "delivfree";
import React, { useCallback, useState } from "react";
import { TextStyle } from "react-native";

interface VendorProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const VendorProfileScreen = (props: VendorProfileScreenProps) => {
  const Alert = useAlert();
  const Toast = useToast();

  const vendor = useAppSelector((state) => state.vendor.activeVendor as Vendor);

  const [{ updates, isSaved }, setUpdates] = useState<{
    updates: Partial<Omit<Vendor, "id">>;
    isSaved: boolean;
  }>({ updates: {}, isSaved: true });
  const [updating, setUpdating] = useState(false);

  const updateValue = (key: keyof Vendor) => (val: string) => {
    setUpdates((s) => ({
      isSaved: false,
      updates: { ...s.updates, [key]: val },
    }));
  };

  const getValue = (key: keyof Vendor) => {
    return key in updates ? updates[key] : vendor[key];
  };

  const handleUpdateVendor = useCallback(async () => {
    try {
      if (updates.email && !isValidEmail(updates.email)) {
        return Alert.alert("Invalid email", "Please enter a valid email.");
      }
      setUpdating(true);
      updateVendor(vendor.id, updates);
      setUpdates((s) => ({ ...s, isSaved: true }));
      setUpdating(false);
      Toast.show("Profile update successfully");
    } catch (error) {
      setUpdating(false);
      console.log("Update vendor error", error);
    }
  }, [updates, vendor?.id]);

  const { exec, loading } = useAsyncFunction(handleUpdateVendor);
  const Loading = useLoadingIndicator(loading);

  return (
    <Screen
      preset="scroll"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <ScreenHeader title={"Profile"} />

      <TextField
        placeholder="First name"
        label="First name"
        containerStyle={$input}
        value={getValue("firstName")}
        onChangeText={updateValue("firstName")}
      />
      <TextField
        placeholder="Last name"
        label="Last name"
        containerStyle={$input}
        value={getValue("lastName")}
        onChangeText={updateValue("lastName")}
      />
      <TextField
        placeholder="Business name"
        label="Business name"
        containerStyle={$input}
        value={getValue("businessName")}
        onChangeText={updateValue("businessName")}
      />
      <TextField
        placeholder="Email"
        label="Email"
        containerStyle={$input}
        value={getValue("email")}
        onChangeText={updateValue("email")}
      />
      <PhoneNumberInput
        placeholder="Phone number"
        label="Phone number"
        containerStyle={$input}
        value={getValue("phoneNumber")}
        onChangeText={updateValue("phoneNumber")}
        onChangeCallingCode={(callingCode, callingCountry) => {
          setUpdates((s) => ({
            isSaved: false,
            updates: { ...s.updates, callingCode, callingCountry },
          }));
        }}
        callingCountry={getValue("callingCountry")}
      />
      <Button
        onPress={exec}
        text="Save profile"
        RightAccessory={Loading}
        style={{ marginTop: spacing.lg }}
        preset={isSaved ? "default" : "reversed"}
      />
    </Screen>
  );
};

const $input: TextStyle = {
  marginTop: spacing.sm,
};
