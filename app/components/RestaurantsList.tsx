import { Cuisine, Restaurant, RestaurantLocation } from "delivfree";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Pressable,
  View,
  ViewStyle,
  FlatListProps,
  TextStyle,
  RefreshControl,
} from "react-native";
import { $image, $imageContainer } from "./styles";
import { spacing } from "app/theme";
import FastImage from "react-native-fast-image";
import { Text } from "./Text";
import { getCuisineImage } from "app/utils/cuisines";
import Animated from "react-native-reanimated";
import RestaurantListItem from "./RestaurantListItem";

interface Props extends Partial<FlatListProps<RestaurantLocation>> {
  restaurants: Restaurant[];
  loadMore?: () => void;
  refreshing: boolean;
  onPress: (restaurant: RestaurantLocation) => void;
}

const RestaurantsList = ({
  restaurants,
  loadMore,
  refreshing,
  onPress,
  ...rest
}: Props) => {
  const renderItem = useCallback(
    ({ item }) => {
      return <RestaurantListItem restaurant={item} onPress={onPress} />;
    },
    [onPress]
  );
  const renderSeparator = useCallback(() => <View style={$separator} />, []);
  const Refresh = useMemo(
    () => <RefreshControl onRefresh={loadMore} refreshing={refreshing} />,
    [loadMore]
  );
  return (
    <Animated.FlatList
      data={restaurants}
      renderItem={renderItem}
      style={$list}
      contentContainerStyle={$content}
      ItemSeparatorComponent={renderSeparator}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={Refresh}
      {...rest}
    />
  );
};

const $list: ViewStyle = { flex: 1 };
const $content: ViewStyle = {
  flexGrow: 1,
};
const $separator: ViewStyle = { height: spacing.md };

export default RestaurantsList;
