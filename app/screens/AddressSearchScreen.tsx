import { updateUser } from "app/apis/user";
import { Button, Icon, Screen, Text } from "app/components";
import GooglePlacesInput from "app/components/GooglePlacesInput";
import {
  $containerPadding,
  $headerButton,
  $screen,
} from "app/components/styles";
import { useAlert } from "app/hooks";
import { translate } from "app/i18n";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { User } from "delivfree";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import * as geofire from "geofire-common";
import { ActivityIndicator, Platform, Pressable, View } from "react-native";
import { colors, spacing } from "app/theme";
import { ScreenHeader } from "app/components/ScreenHeader";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";

interface AddressSearchScreenProps
  extends AppStackScreenProps<"AddressSearch"> {}

export const AddressSearchScreen = ({
  navigation,
}: AddressSearchScreenProps) => {
  const Alert = useAlert();

  const authToken = useAppSelector((state) => state.auth.authToken as string);

  const [confirmingAddress, setConfirmingLocation] = useState(false);
  const [placesData, setPlacesData] = useState<GooglePlaceDetail>();

  const confirmAddress = useCallback(async () => {
    try {
      if (!placesData) {
        throw "missing_address";
      }
      const city = placesData.address_components.find(
        (comp) =>
          comp.types.includes("locality") ||
          comp.types.includes("administrative_area_level_3")
      )?.long_name;
      const country = placesData.address_components.find((comp) =>
        comp.types.includes("country")
      )?.short_name;
      console.log(placesData.address_components);
      placesData.formatted_address;
      const address = placesData.formatted_address; // `${city}, ${country}`;
      const { lat, lng } = placesData.geometry.location;
      const geohash = geofire.geohashForLocation([lat, lng]);
      const location: User["location"] = {
        latitude: placesData.geometry.location.lat,
        longitude: placesData.geometry.location.lng,
        address,
        geohash,
      };
      setConfirmingLocation(true);
      await updateUser(authToken, { location });
      navigation.goBack();
      setConfirmingLocation(false);
    } catch (error) {
      setConfirmingLocation(false);
      Alert.alert(translate("errors.heading"), translate("errors.common"));
    }
  }, [placesData]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      navigation.setOptions({
        headerRight: () =>
          !(placesData || confirmingAddress) ? null : confirmingAddress ? (
            <ActivityIndicator color={colors.primary} style={$headerButton} />
          ) : (
            <Pressable onPress={confirmAddress} style={$headerButton}>
              <Icon icon={"check-circle"} color={colors.primary} />
            </Pressable>
          ),
      });
    }
  }, [confirmAddress, placesData, confirmingAddress]);

  const ConfirmingAddress = useLoadingIndicator(confirmingAddress);

  const WebConfirmButton = useMemo(
    () =>
      Platform.OS === "web" && placesData ? (
        <View style={{ marginVertical: spacing.md }}>
          <Text preset="semibold" style={{ marginBottom: spacing.sm }}>
            {placesData.formatted_address}
          </Text>
          <Button
            preset="reversed"
            text="Confirm address"
            onPress={confirmAddress}
            RightAccessory={ConfirmingAddress}
          />
        </View>
      ) : undefined,
    [placesData]
  );

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <ScreenHeader title="Enter your address" />
      <GooglePlacesInput
        onPress={(data, detail) => {
          setPlacesData(detail);
        }}
        inbetweenCompo={WebConfirmButton}
      />
    </Screen>
  );
};
