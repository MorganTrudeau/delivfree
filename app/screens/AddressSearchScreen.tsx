import { updateUser } from "app/apis/user";
import { Icon, Screen } from "app/components";
import GooglePlacesInput from "app/components/GooglePlacesInput";
import { $containerPadding, $screen } from "app/components/styles";
import { useAlert } from "app/hooks";
import { translate } from "app/i18n";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { User } from "functions/src/types";
import React, { useCallback, useEffect, useState } from "react";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import * as geofire from "geofire-common";
import { ActivityIndicator, Pressable } from "react-native";
import { colors } from "app/theme";

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
      const address = `${city}, ${country}`;
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
    if (placesData || confirmAddress) {
      navigation.setOptions({
        headerRight: () =>
          confirmingAddress ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Pressable onPress={confirmAddress}>
              <Icon icon={"check-circle"} color={colors.primary} />
            </Pressable>
          ),
      });
    }
  }, [confirmAddress, placesData, confirmAddress]);

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <GooglePlacesInput
        onPress={(data, detail) => {
          console.log(detail.address_components);
          setPlacesData(detail);
        }}
      />
    </Screen>
  );
};
