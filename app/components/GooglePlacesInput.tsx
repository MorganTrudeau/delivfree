import React from "react";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  Styles,
} from "react-native-google-places-autocomplete";
import { $input } from "./styles";
import { colors } from "app/theme";

const API_KEY = "AIzaSyD0evHPMfgWWvkNA2E7ssT_zWFNZMnhp_M";

type Props = {
  onPress: (data: GooglePlaceData, detail: GooglePlaceDetail) => void;
};

const GooglePlacesInput = ({ onPress }: Props) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      // @ts-ignore
      onPress={onPress}
      query={query}
      requestUrl={requestUrl}
      styles={styles}
      fetchDetails
      textInputProps={{ placeholderTextColor: colors.textDim }}
    />
  );
};
const requestUrl = {
  useOnPlatform: "all" as const,
  url: "http://127.0.0.1:5001/delivfree-app/us-central1/googlePlaces",
};
const query = {
  key: API_KEY,
  language: "en",
};
const styles: Partial<Styles> = { textInput: $input };

export default GooglePlacesInput;
