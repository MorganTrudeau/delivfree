import { Restaurant } from "delivfree";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Pressable,
  View,
  ViewStyle,
  FlatListProps,
} from "react-native";
import { $image, $imageContainer } from "./styles";
import { spacing } from "app/theme";
import FastImage from "react-native-fast-image";
import { Text } from "./Text";

interface Props extends Partial<FlatListProps<Restaurant>> {
  restaurants: Restaurant[];
  loadMore: () => void;
}

const RestaurantsList = ({ restaurants, loadMore, ...rest }: Props) => {
  const renderItem = useCallback((item) => {
    return (
      <Pressable>
        <View style={$imageContainer}>
          <FastImage source={item.image} style={$image} />
        </View>
        <Text preset={"subheading"} style={$title}>
          {item.title}
        </Text>
      </Pressable>
    );
  }, []);
  const renderSeparator = useCallback(() => <View style={$separator} />, []);
  const ListEmptyComponent = useMemo(
    () => <Text preset={"subheading"}>Coming Soon in your area!</Text>,
    []
  );
  return (
    <FlatList
      data={restaurants}
      renderItem={renderItem}
      style={$list}
      contentContainerStyle={$content}
      ItemSeparatorComponent={renderSeparator}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={ListEmptyComponent}
      {...rest}
    />
  );
};

const $list: ViewStyle = { flex: 1 };
const $content: ViewStyle = {
  flexGrow: 1,
};
const $title = { marginTop: spacing.xxs };
const $separator: ViewStyle = { height: spacing.md };

export default RestaurantsList;
