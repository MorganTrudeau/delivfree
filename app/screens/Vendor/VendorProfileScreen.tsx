import { updateVendor } from "app/apis/vendor";
import { HeaderProps, Icon, Screen, Text, TextField } from "app/components";
import { Drawer } from "app/components/Drawer";
import { $containerPadding, $flex, $row, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { Vendor } from "delivfree";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  TextStyle,
  View,
} from "react-native";

interface VendorProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const VendorProfileScreen = (props: VendorProfileScreenProps) => {
  const vendor = useAppSelector((state) => state.vendor.data as Vendor);

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
      setUpdating(true);
      updateVendor(vendor.id, updates);
      setUpdates((s) => ({ ...s, isSaved: true }));
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      console.log("Update vendor error", error);
    }
  }, [updates, vendor?.id]);

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
          placeholder="Business name"
          label="Business name"
          containerStyle={$input}
          value={getValue("businessName")}
          onChangeText={updateValue("businessName")}
        />
        <TextField
          placeholder="Phone number"
          label="Phone number"
          containerStyle={$input}
          value={getValue("phoneNumber")}
          onChangeText={updateValue("phoneNumber")}
        />
      </Screen>
    </Drawer>
  );
};

const $input: TextStyle = {
  marginTop: spacing.sm,
};
