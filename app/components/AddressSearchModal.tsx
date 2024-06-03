import React, { forwardRef } from "react";
import ReanimatedCenterModal, { ModalRef } from "./Modal/CenterModal";
import { View } from "react-native";
import { LocationInput } from "./LocationInput";
import { GeoLocation } from "delivfree";
import { spacing } from "app/theme";
import { MAX_CENTER_MODAL_WIDTH } from "./styles";
import { Text } from "./Text";

interface Props {
  onLocationSelected: (location: GeoLocation) => void;
  shortenAddress: boolean;
}

export const AddressSearchModal = forwardRef<ModalRef, Props>(
  function AddressSearchModal({ onLocationSelected, shortenAddress }, ref) {
    return (
      <ReanimatedCenterModal
        ref={ref}
        contentStyle={{ maxWidth: MAX_CENTER_MODAL_WIDTH - spacing.md * 2 }}
      >
        <View style={{ height: 400, padding: spacing.md }}>
          <Text preset="subheading" style={{ marginBottom: spacing.sm }}>
            Address Search
          </Text>
          <LocationInput
            onLocationSelected={onLocationSelected}
            shortenAddress={shortenAddress}
          />
        </View>
      </ReanimatedCenterModal>
    );
  }
);
