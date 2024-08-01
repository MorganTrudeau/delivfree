import { updateUser } from "app/apis/user";
import { Button, Screen, Text } from "app/components";
import GooglePlacesInput from "app/components/GooglePlacesInput";
import { $containerPadding, $screen } from "app/components/styles";
import { useAlert } from "app/hooks";
import { translate } from "app/i18n";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { User } from "delivfree";
import React, { useCallback, useMemo, useState } from "react";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import * as geofire from "geofire-common";
import { View } from "react-native";
import { spacing } from "app/theme";
import { ScreenHeader } from "app/components/ScreenHeader";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { formatAddressFromComponents } from "app/utils/geolocation";

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
      const address = formatAddressFromComponents(
        placesData.address_components
      );
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

  const ConfirmingAddress = useLoadingIndicator(confirmingAddress);

  const WebConfirmButton = useMemo(
    () =>
      placesData ? (
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
    [placesData, ConfirmingAddress]
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
