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
import { formatAddressFromComponents } from "app/utils/geolocation";

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
    let address = formatAddressFromComponents(detail.address_components);
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
