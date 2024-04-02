import React from "react";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { $input } from "./styles";

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
      styles={styles}
      fetchDetails
    />
  );
};

const query = {
  key: API_KEY,
  language: "en",
};
const styles = { textInput: $input };

export default GooglePlacesInput;
