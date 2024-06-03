import { updateDriver } from "app/apis/driver";
import { updateVendor } from "app/apis/vendors";
import { HeaderProps, Icon, Screen, Text, TextField } from "app/components";
import { Drawer } from "app/components/Drawer";
import { DriversLicenseUpload } from "app/components/DriversLicenseUpload";
import { $containerPadding, $flex, $row, $screen } from "app/components/styles";
import { useToast } from "app/hooks";
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
  const Toast = useToast();

  const driver = useAppSelector((state) => state.driver.activeDriver as Driver);

  const [{ updates, isSaved }, setUpdates] = useState<{
    updates: Partial<Omit<Driver, "id">>;
    isSaved: boolean;
  }>({ updates: {}, isSaved: true });
  const [updating, setUpdating] = useState(false);

  const updateValue = (key: keyof Driver) => (val: string) => {
    setUpdates((s) => ({
      isSaved: false,
      updates: { ...s.updates, [key]: val },
    }));
  };

  const getValue = (key: keyof Driver) => {
    return key in updates ? updates[key] : driver[key];
  };

  const handleUpdateVendor = useCallback(async () => {
    try {
      setUpdating(true);
      updateDriver(driver.id, updates);
      setUpdates((s) => ({ ...s, isSaved: true }));
      setUpdating(false);
      Toast.show("Profile updated!");
    } catch (error) {
      setUpdating(false);
      console.log("Update vendor error", error);
    }
  }, [updates, driver?.id]);

  const headerProps: HeaderProps = useMemo(
    () => ({
      RightActionComponent: updating ? (
        <ActivityIndicator color={colors.primary} />
      ) : !isSaved ? (
        <Pressable onPress={handleUpdateVendor}>
          <Icon icon="check-circle" color={colors.primary} />
        </Pressable>
      ) : undefined,
    }),
    [isSaved, handleUpdateVendor]
  );

  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
        headerProps={headerProps}
        inDrawer
      >
        <View style={$row}>
          <Text preset="heading" style={$flex}>
            Profile
          </Text>
          {Platform.OS === "web" &&
            !isSaved &&
            (updating ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Pressable onPress={handleUpdateVendor} style={$row}>
                <Text>Save</Text>
                <Icon
                  icon="check-circle"
                  color={colors.primary}
                  style={{ marginLeft: spacing.xxs }}
                />
              </Pressable>
            ))}
        </View>
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
      </Screen>
    </Drawer>
  );
};

const $input: TextStyle = {
  marginTop: spacing.sm,
};
