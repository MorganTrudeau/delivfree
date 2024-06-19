import React from "react";
import GooglePlacesInput from "./GooglePlacesInput";
import * as geofire from "geofire-common";
import { GeoLocation } from "delivfree";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import { translate } from "app/i18n";
import { useToast } from "app/hooks";

export const LocationInput = ({
  onLocationSelected,
  shortenAddress,
}: {
  onLocationSelected: (location: GeoLocation) => void;
  shortenAddress: boolean;
}) => {
  const Toast = useToast();
  const handlePress = (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null
  ) => {
    if (!detail) {
      return Toast.show(translate("errors.common"));
    }
    let address = detail.formatted_address;

    if (shortenAddress) {
      const city = detail.address_components.find(
        (comp) =>
          comp.types.includes("locality") ||
          comp.types.includes("administrative_area_level_3")
      )?.long_name;
      const country = detail.address_components.find((comp) =>
        comp.types.includes("country")
      )?.short_name;
      console.log(detail.address_components);
      address = `${city}, ${country}`;
    }

    const { lat, lng } = detail.geometry.location;
    const geohash = geofire.geohashForLocation([lat, lng]);
    const location = {
      latitude: detail.geometry.location.lat,
      longitude: detail.geometry.location.lng,
      address,
      geohash,
    };
    onLocationSelected(location);
  };

  return <GooglePlacesInput onPress={handlePress} />;
};
