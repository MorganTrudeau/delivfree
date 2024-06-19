import { updateDriver } from "app/apis/driver";
import { updateVendor } from "app/apis/vendors";
import {
  Button,
  HeaderProps,
  Icon,
  Screen,
  Text,
  TextField,
} from "app/components";
import { Drawer } from "app/components/Drawer";
import { DriversLicenseUpload } from "app/components/DriversLicenseUpload";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $flex, $row, $screen } from "app/components/styles";
import { useToast } from "app/hooks";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { Driver, Vendor } from "delivfree";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  TextStyle,
  View,
} from "react-native";

interface DriverProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const DriverProfileScreen = (props: DriverProfileScreenProps) => {
  const driver = useAppSelector((state) => state.driver.activeDriver as Driver);

  const [{ updates, isSaved }, setUpdates] = useState<{
    updates: Partial<Omit<Driver, "id">>;
    isSaved: boolean;
  }>({ updates: {}, isSaved: true });

  const updateValue = (key: keyof Driver) => (val: string) => {
    setUpdates((s) => ({
      isSaved: false,
      updates: { ...s.updates, [key]: val },
    }));
  };

  const getValue = (key: keyof Driver) => {
    return key in updates ? updates[key] : driver[key];
  };

  const handleUpdateDriver = useCallback(async () => {
    updateDriver(driver.id, updates);
    setUpdates((s) => ({ ...s, isSaved: true }));
  }, [updates, driver?.id]);

  const { exec, loading } = useAsyncFunction(handleUpdateDriver);
  const Loading = useLoadingIndicator(loading);

  return (
    <Screen
      preset="scroll"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <ScreenHeader title="Profile" />
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
        placeholder="Phone number"
        label="Phone number"
        containerStyle={$input}
        value={getValue("phoneNumber")}
        onChangeText={updateValue("phoneNumber")}
      />
      <DriversLicenseUpload
        frontImage={driver.driversLicenseFront}
        backImage={driver.driversLicenseBack}
        onFrontImageUploaded={updateValue("driversLicenseFront")}
        onBackImageUploaded={updateValue("driversLicenseBack")}
        style={$input}
        driverId={driver.id}
        viewOnly
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
