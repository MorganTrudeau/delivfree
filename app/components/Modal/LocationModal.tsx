import React, { forwardRef, useMemo, useState } from "react";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import { Button } from "../Button";
import { Text } from "../Text";
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native";
import { colors, spacing } from "app/theme";
import { useGeoPosition } from "app/hooks/useGeoPosition";
import * as Location from "expo-location";
import { updateUser } from "app/apis/user";
import { translate } from "app/i18n";
import { useAlert } from "app/hooks";
import { useAppSelector } from "app/redux/store";
import { User } from "functions/src/types";

interface Props {
  onRequestClose: () => void;
}

const LocationContent = ({ onRequestClose }: Props) => {
  const Alert = useAlert();
  const activeUser = useAppSelector((state) => state.user.user as User);

  const [findingLocation, setFindingLocation] = useState(false);
  const [confirmingLocation, setConfirmingLocation] = useState(false);
  const [location, setLocation] = useState<User["location"]>(null);
  const { getLocation } = useGeoPosition();

  const findMyLocation = async () => {
    setFindingLocation(true);
    const location = await getLocation();
    if (!location) {
      setFindingLocation(false);
      return;
    }
    const {
      position: { latitude, longitude },
    } = location;
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      for (const item of response) {
        const address = `${item.city}, ${item.isoCountryCode}`;
        setLocation({ latitude, longitude, address });
      }
      setFindingLocation(false);
    } catch (error) {
      setFindingLocation(false);
    }
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

  const LocationLoading = useMemo(
    () =>
      findingLocation
        ? () => <ActivityIndicator color={colors.text} style={$spinner} />
        : undefined,
    [findingLocation]
  );
  const ConfirmLoading = useMemo(
    () =>
      confirmingLocation
        ? () => <ActivityIndicator color={colors.text} style={$spinner} />
        : undefined,
    [confirmingLocation]
  );

  return (
    <View style={$content}>
      <Text preset={"subheading"} style={$heading}>
        Find restaurants in your area
      </Text>
      {!!location?.address ? (
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
      ) : (
        <Button
          text={"Find my address"}
          preset={"filled"}
          style={$button}
          onPress={findMyLocation}
          RightAccessory={LocationLoading}
        />
      )}
      <Button text={"Enter my address"} style={$button} />
    </View>
  );
};

const LocationModal = forwardRef<BottomSheetRef, Props>(function LocationModal(
  { onRequestClose },
  ref
) {
  const activeUser = useAppSelector((state) => state.user.user as User);
  return (
    <BottomSheet
      ref={ref}
      snapPoints={["45%"]}
      enablePanDownToClose={!!activeUser.location}
    >
      <LocationContent onRequestClose={onRequestClose} />
    </BottomSheet>
  );
});

export default LocationModal;

const $content: ViewStyle = { padding: spacing.md };
const $button: ViewStyle = { marginTop: spacing.sm };
const $spinner: ViewStyle = { marginLeft: spacing.sm };
const $heading: TextStyle = { textAlign: "center", marginBottom: spacing.xs };
const $address: TextStyle = { textAlign: "center", marginBottom: spacing.xs };
