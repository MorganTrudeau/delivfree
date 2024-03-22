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
import { $shadow } from "../styles";
import { borderRadius } from "app/theme/borderRadius";
import { colors, spacing } from "app/theme";
import { Text } from "../Text";
import { data } from "../../utils/cuisines";
import { Cuisine } from "functions/src/types";

interface Props extends Partial<FlatListProps<Data>> {
  onPress: (cuisine: Cuisine) => void;
}

const CuisineList = ({ onPress, contentContainerStyle, ...rest }: Props) => {
  const _contentContainerStyle = useMemo(
    () => [$content, contentContainerStyle],
    [contentContainerStyle]
  );
  const renderItem = useCallback(
    ({ item }: { item: (typeof data)[number] }) => {
      return (
        <Pressable onPress={() => onPress(item.cuisine)}>
          <View style={$imageContainer}>
            <FastImage source={item.image} style={$image} />
          </View>
          <Text preset={"subheading"} style={$title}>
            {item.title}
          </Text>
        </Pressable>
      );
    },
    [onPress]
  );
  const renderSeparator = useCallback(() => <View style={$separator} />, []);
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
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

const keyExtractor = (item: Data) => item.cuisine;

const $imageContainer: StyleProp<ViewStyle> = [
  $shadow,
  {
    borderRadius: borderRadius.md,
    width: "100%",
    aspectRatio: 2.8,
    backgroundColor: colors.background,
  },
];
const $image: ImageStyle = {
  ...StyleSheet.absoluteFillObject,
  borderRadius: borderRadius.md,
};
const $list: ViewStyle = { flex: 1 };
const $content: ViewStyle = {
  flexGrow: 1,
};
const $title = { marginTop: spacing.xxs };
const $separator: ViewStyle = { height: spacing.md };

type Data = (typeof data)[number];
