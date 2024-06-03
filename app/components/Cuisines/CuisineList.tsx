import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  FlatListProps,
} from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { $image, $imageContainer, $shadow } from "../styles";
import { borderRadius } from "app/theme/borderRadius";
import { colors, spacing } from "app/theme";
import { Text } from "../Text";
import { data } from "../../utils/cuisines";
import { Cuisine, Vendor, VendorLocation } from "delivfree";
import RestaurantListItem from "../RestaurantListItem";

interface Props extends Partial<FlatListProps<Data | VendorLocation>> {
  onCuisinePress: (cuisine: Cuisine) => void;
  onRestaurantPress: (restaurant: VendorLocation) => void;
  restaurants: VendorLocation[];
  showRestaurants: boolean;
}

const CuisineList = ({
  onCuisinePress,
  onRestaurantPress,
  contentContainerStyle,
  restaurants,
  showRestaurants,
  ...rest
}: Props) => {
  const _contentContainerStyle = useMemo(
    () => [$content, contentContainerStyle],
    [contentContainerStyle]
  );
  const renderCuisine = useCallback(
    ({ item }: { item: Data }) => {
      return (
        <Pressable onPress={() => onCuisinePress(item.cuisine)}>
          <View style={[$imageContainer, { maxWidth: 400 }]}>
            <FastImage source={item.image} style={$image} />
          </View>
          <Text preset={"subheading"} style={$title}>
            {item.title}
          </Text>
        </Pressable>
      );
    },
    [onCuisinePress]
  );
  const renderRestaurant = useCallback(
    ({ item }: { item: VendorLocation }) => {
      return (
        <RestaurantListItem restaurant={item} onPress={onRestaurantPress} />
      );
    },
    [onRestaurantPress]
  );
  const renderSeparator = useCallback(() => <View style={$separator} />, []);
  return (
    <FlatList
      data={showRestaurants ? restaurants : data}
      // @ts-ignore
      renderItem={showRestaurants ? renderRestaurant : renderCuisine}
      style={$list}
      contentContainerStyle={_contentContainerStyle}
      ItemSeparatorComponent={renderSeparator}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      {...rest}
    />
  );
};

export default CuisineList;

const keyExtractor = (item: Data | VendorLocation) =>
  "id" in item ? item.id : item.cuisine;

const $list: ViewStyle = { flex: 1 };
const $content: ViewStyle = {
  flexGrow: 1,
};
const $title = { marginTop: spacing.xxs };
const $separator: ViewStyle = { height: spacing.md };

type Data = (typeof data)[number];
