import { RestaurantLocation } from "delivfree";
import React, { useCallback, useMemo } from "react";
import { View, ViewStyle, FlatListProps, RefreshControl } from "react-native";
import { spacing } from "app/theme";
import { Text } from "./Text";
import Animated from "react-native-reanimated";
import RestaurantListItem from "./RestaurantListItem";
import { EmptyList } from "./EmptyList";

interface Props extends Partial<FlatListProps<RestaurantLocation>> {
  restaurants: RestaurantLocation[];
  loadMore?: () => void;
  refreshing?: boolean;
  onPress?: (restaurant: RestaurantLocation) => void;
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
    () => <RefreshControl onRefresh={loadMore} refreshing={!!refreshing} />,
    [loadMore]
  );
  const renderListEmpty = useMemo(
    () => <EmptyList title="No restaurant locations found" />,
    []
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
      ListEmptyComponent={renderListEmpty}
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
