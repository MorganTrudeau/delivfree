import React from "react";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteProps,
  Styles,
} from "react-native-google-places-autocomplete";
import { $input } from "./styles";
import { colors } from "app/theme";

const API_KEY = "AIzaSyD0evHPMfgWWvkNA2E7ssT_zWFNZMnhp_M";

type Props = {
  onPress: (data: GooglePlaceData, detail: GooglePlaceDetail) => void;
} & Partial<GooglePlacesAutocompleteProps>;

const GooglePlacesInput = ({ onPress, ...rest }: Props) => {
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
      {...rest}
    />
  );
};
const requestUrl = {
  useOnPlatform: "all" as const,
  url: "https://us-central1-delivfree-app.cloudfunctions.net/googlePlaces",
};
const query = {
  key: API_KEY,
  language: "en",
};
const styles: Partial<Styles> = {
  textInput: $input,
  description: { color: colors.text },
};

export default GooglePlacesInput;
