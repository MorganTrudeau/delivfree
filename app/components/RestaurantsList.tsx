import { VendorLocation } from "delivfree";
import React, { useCallback, useMemo } from "react";
import { View, ViewStyle, FlatListProps, RefreshControl } from "react-native";
import { spacing } from "app/theme";
import Animated from "react-native-reanimated";
import RestaurantListItem from "./RestaurantListItem";
import { EmptyList } from "./EmptyList";
import { useDimensions } from "app/hooks/useDimensions";
import { MAX_CONTENT_WIDTH } from "./styles";

interface Props
  extends Partial<
    Omit<FlatListProps<VendorLocation>, "CellRendererComponent">
  > {
  restaurants: VendorLocation[];
  loadMore?: () => void;
  refreshing?: boolean;
  onPress?: (restaurant: VendorLocation) => void;
}

const RestaurantsList = ({
  restaurants,
  loadMore,
  refreshing,
  onPress,
  onRefresh,
  contentContainerStyle,
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
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <RestaurantListItem
          restaurant={item}
          onPress={onPress}
          style={{ width: `${itemWidth}%` }}
        />
      );
    },
    [onPress]
  );
  const renderSeparator = useCallback(() => <View style={$separator} />, []);
  const Refresh = useMemo(
    () =>
      onRefresh ? (
        <RefreshControl onRefresh={onRefresh} refreshing={!!refreshing} />
      ) : undefined,
    [onRefresh]
  );
  const renderListEmpty = useMemo(
    () => <EmptyList title="No restaurant locations found" />,
    []
  );
  return (
    <Animated.FlatList
      key={numColumns}
      numColumns={numColumns}
      data={restaurants}
      renderItem={renderItem}
      style={$list}
      contentContainerStyle={_contentContainerStyle}
      ItemSeparatorComponent={renderSeparator}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={Refresh}
      ListEmptyComponent={renderListEmpty}
      columnWrapperStyle={
        numColumns > 1
          ? {
              columnGap: spacing.md,
            }
          : undefined
      }
      {...rest}
    />
  );
};

const $list: ViewStyle = { flex: 1 };
const $content: ViewStyle = {
  flexGrow: 1,
  columnGap: spacing.sm,
};
const $separator: ViewStyle = { height: spacing.md };

export default RestaurantsList;
