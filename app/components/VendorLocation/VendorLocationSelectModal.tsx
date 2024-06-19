import { VendorLocation } from "delivfree/types";
import React, { forwardRef } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { spacing } from "app/theme";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import { $borderBottom } from "../styles";

type Props = {
  vendorLocations: VendorLocation[];
  onPress: (location: VendorLocation) => void;
};

const VendorLocationSelect = ({ vendorLocations, onPress }: Props) => {
  return (
    <View style={$container}>
      <Text preset="subheading">Select a location</Text>
      {vendorLocations.map((location, index, arr) => {
        return (
          <Pressable
            style={[$item, index !== arr.length - 1 && $borderBottom]}
            onPress={() => onPress(location)}
            key={location.id}
          >
            <Text>{location.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export const VendorLocationSelectModal = forwardRef<ModalRef, Props>(
  function VendorLocationSelectModal(props, ref) {
    return (
      <ReanimatedCenterModal ref={ref}>
        <VendorLocationSelect {...props} />
      </ReanimatedCenterModal>
    );
  }
);

const $container: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
};
const $item: ViewStyle = {
  paddingVertical: spacing.sm,
};
