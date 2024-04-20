import { Vendor, RestaurantLocation } from "delivfree";
import React from "react";
import { $image, $imageContainer } from "./styles";
import { Pressable, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Text } from "./Text";
import { spacing } from "app/theme";

interface Props {
  restaurant: RestaurantLocation;
  onPress?: (restaurant: RestaurantLocation) => void;
}

const RestaurantListItem = ({ restaurant, onPress }: Props) => {
  return (
    <Pressable onPress={() => onPress?.(restaurant)}>
      <View style={$imageContainer}>
        <FastImage source={{ uri: restaurant.image }} style={$image} />
      </View>
      <Text preset={"subheading"} style={$title}>
        {restaurant.name}
      </Text>
    </Pressable>
  );
};

const $title = { marginTop: spacing.xxs };

export default RestaurantListItem;
