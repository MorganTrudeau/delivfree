import { VendorLocation } from "delivfree";
import React from "react";
import { $image, $imageContainer } from "./styles";
import { Pressable, View, ViewStyle, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";
import { Icon } from "./Icon";
import { MenuNextOpen } from "./Menus/MenuNextOpen";
import { borderRadius } from "app/theme/borderRadius";

interface Props {
  restaurant: VendorLocation;
  onPress?: (restaurant: VendorLocation) => void;
  style?: ViewStyle
}

const RestaurantListItem = ({ restaurant, onPress, style }: Props) => {
  return (
    <Pressable onPress={() => onPress?.(restaurant)} style={style}>
      <View
        style={[$imageContainer, { maxWidth: 400, marginBottom: spacing.xxs }]}
      >
        <FastImage source={{ uri: restaurant.image }} style={$image} />
        {!restaurant.isOpen && (
          <View style={$closedOverlay}>
            <Icon icon={"weather-night"} color={colors.white} />
            <Text style={{ color: colors.white }}>Closed</Text>
          </View>
        )}
      </View>
      {!restaurant.isOpen && !!restaurant.nextOpen && (
        <MenuNextOpen nextOpen={restaurant.nextOpen} />
      )}
      <Text preset={"semibold"} size={"lg"}>
        {restaurant.name}
      </Text>
      {!restaurant.isOpen && (
        <Text style={{ color: colors.textDim }}>Closed</Text>
      )}
    </Pressable>
  );
};

const $closedOverlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
  borderRadius: borderRadius.md,
};

export default RestaurantListItem;
