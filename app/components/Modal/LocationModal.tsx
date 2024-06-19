import React, { forwardRef, useMemo, useState } from "react";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import { Button } from "../Button";
import { Text } from "../Text";
import {
  ActivityIndicator,
  Platform,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { spacing } from "app/theme";
import { useGeoPosition } from "app/hooks/useGeoPosition";
import * as Location from "expo-location";
import { updateUser } from "app/apis/user";
import { translate } from "app/i18n";
import { useAlert } from "app/hooks";
import { useAppSelector } from "app/redux/store";
import { User } from "delivfree";
import * as geofire from "geofire-common";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "app/navigators";

interface Props {
  onRequestClose: () => void;
  title?: string;
}

const LocationContent = ({ onRequestClose, title }: Props) => {
  const navigation = useNavigation<NavigationProp>();

  const Alert = useAlert();
  const activeUser = useAppSelector((state) => state.user.user as User);

  const [findingLocation, setFindingLocation] = useState(false);
  const [confirmingLocation, setConfirmingLocation] = useState(false);
  const [location, setLocation] = useState<User["location"]>(null);
  const { watchLocation, getLocation } = useGeoPosition();

  const processLocation = async (
    location: {
      position: {
        latitude: number;
        longitude: number;
      };
    } | null
  ) => {
    console.log(location);
    if (!location) {
      setFindingLocation(false);
      return;
    }
    const {
      position: { latitude, longitude },
    } = location;
    const geohash = geofire.geohashForLocation([latitude, longitude]);
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      for (const item of response) {
        const address = `${item.city}, ${item.isoCountryCode}`;
        setLocation({ latitude, longitude, address, geohash });
      }
      setFindingLocation(false);
    } catch (error) {
      setFindingLocation(false);
    }
  };

  const findMyLocation = async () => {
    setFindingLocation(true);

    if (Platform.OS === "web") {
      const location = await getLocation();
      return processLocation(location);
    }

    const unsubscribe = await watchLocation(
      async (location) => {
        if (!location) {
          setFindingLocation(false);
          return;
        }
        unsubscribe();
        return processLocation(location);
      },
      () => {
        setFindingLocation(false);
      }
    );
  };

  const confirmLocation = async () => {
    try {
      if (!location) {
        throw "missing_address";
      }
      setConfirmingLocation(true);
      await updateUser(activeUser.id, { location });
      onRequestClose();
      setLocation(null);
      setConfirmingLocation(false);
    } catch (error) {
      setConfirmingLocation(false);
      Alert.alert(translate("errors.heading"), translate("errors.common"));
    }
  };

  const enterAddress = () => {
    onRequestClose();
    navigation.navigate("AddressSearch");
  };

  const LocationLoading = useMemo(
    () =>
      findingLocation
        ? () => <ActivityIndicator color={"#fff"} style={$spinner} />
        : undefined,
    [findingLocation]
  );
  const ConfirmLoading = useMemo(
    () =>
      confirmingLocation
        ? () => <ActivityIndicator color={"#fff"} style={$spinner} />
        : undefined,
    [confirmingLocation]
  );

  return (
    <View style={$content}>
      <Text preset={"subheading"} style={$heading}>
        {title || "Find restaurants in your area"}
      </Text>

      {!!location?.address && (
        <>
          <Text style={$address}>{location?.address}</Text>
          <Button
            text={"Confirm address"}
            preset={"filled"}
            style={$button}
            onPress={confirmLocation}
            RightAccessory={ConfirmLoading}
          />
        </>
      )}

      {!location?.address && Platform.OS !== "web" && (
        <Button
          text={"Find my address"}
          preset={"filled"}
          style={$button}
          onPress={findMyLocation}
          RightAccessory={LocationLoading}
        />
      )}

      <Button
        text={"Enter my address"}
        style={$button}
        onPress={enterAddress}
      />
    </View>
  );
};

const snapPoints = ["45%"];

const LocationModal = forwardRef<BottomSheetRef, Props>(function LocationModal(
  { onRequestClose, ...rest },
  ref
) {
  const activeUser = useAppSelector((state) => state.user.user as User);
  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={!!activeUser.location}
    >
      <LocationContent onRequestClose={onRequestClose} {...rest} />
    </BottomSheet>
  );
});

export default LocationModal;

const $content: ViewStyle = { padding: spacing.md };
const $button: ViewStyle = { marginTop: spacing.sm };
const $spinner: ViewStyle = { marginLeft: spacing.sm };
const $heading: TextStyle = { textAlign: "center", marginBottom: spacing.xs };
const $address: TextStyle = { textAlign: "center", marginBottom: spacing.xs };
