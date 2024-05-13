import React, { useRef } from "react";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";
import { Location, ModalRef } from "delivfree";
import { Pressable, ViewStyle } from "react-native";
import { AddressSearchModal } from "./AddressSearchModal";
import { $input } from "./styles";

export const AddressSearchField = ({
  location,
  onLocationSelect,
}: {
  location: Location;
  onLocationSelect: (location: Location) => void;
}) => {
  const addressSearchModal = useRef<ModalRef>(null);
  return (
    <>
      <Text
        preset="formLabel"
        style={{ marginBottom: spacing.xs, marginTop: spacing.sm }}
      >
        Address
      </Text>
      <Pressable
        onPress={() => addressSearchModal.current?.open()}
        style={$input}
      >
        <Text style={!location.address ? { color: colors.textDim } : undefined}>
          {location.address ? location.address : "Search Address"}
        </Text>
      </Pressable>
      <AddressSearchModal
        ref={addressSearchModal}
        onLocationSelected={(location) => {
          addressSearchModal.current?.close();
          onLocationSelect({
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            geohash: location.geohash,
          });
        }}
        shortenAddress={false}
      />
    </>
  );
};
