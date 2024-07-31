import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Pressable,
  ViewStyle,
  View,
  FlatListProps,
} from "react-native";
import FastImage from "react-native-fast-image";
import { $image, $imageContainer, MAX_CONTENT_WIDTH } from "../styles";
import { spacing } from "app/theme";
import { Text } from "../Text";
import { data } from "../../utils/cuisines";
import { Cuisine, VendorLocation } from "delivfree";
import RestaurantListItem from "../RestaurantListItem";
import { useDimensions } from "app/hooks/useDimensions";

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
  const { width } = useDimensions();
  const containerWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const numColumns = useMemo(
    () => Math.min(3, Math.floor(containerWidth / 300)),
    [containerWidth]
  );
  const availableSpace = containerWidth - (numColumns - 1) * spacing.md;
  const itemWidth = (availableSpace / numColumns / containerWidth) * 100;
  const _contentContainerStyle = useMemo(
    () => [$content, contentContainerStyle],
    [contentContainerStyle]
  );
  const renderCuisine = useCallback(
    ({ item }: { item: Data }) => {
      return (
        <Pressable
          onPress={() => onCuisinePress(item.cuisine)}
          style={[$cuisineListItem, { width: `${itemWidth}%` }]}
        >
          <View style={[$imageContainer, { maxWidth: 500 }]}>
            <FastImage
              source={item.image}
              style={$image}
              resizeMode="cover"
            />
          </View>
          <Text preset={"subheading"} style={$title}>
            {item.title}
          </Text>
        </Pressable>
      );
    },
    [onCuisinePress, itemWidth]
  );
  const renderRestaurant = useCallback(
    ({ item }: { item: VendorLocation }) => {
      return (
        <RestaurantListItem
          restaurant={item}
          onPress={onRestaurantPress}
          style={{ width: `${itemWidth}%` }}
        />
      );
    },
    [onRestaurantPress]
  );
  const renderSeparator = useCallback(() => <View style={$separator} />, []);
  return (
    <FlatList
      key={numColumns}
      numColumns={numColumns}
      data={showRestaurants ? restaurants : data}
      // @ts-ignore
      renderItem={showRestaurants ? renderRestaurant : renderCuisine}
      style={$list}
      contentContainerStyle={_contentContainerStyle}
      ItemSeparatorComponent={renderSeparator}
      columnWrapperStyle={
        numColumns > 1
          ? {
              columnGap: spacing.md,
            }
          : undefined
      }
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
  columnGap: spacing.sm,
};
const $title = { marginTop: spacing.xxs };
const $separator: ViewStyle = { height: spacing.md };
const $cuisineListItem: ViewStyle = {};

type Data = (typeof data)[number];
