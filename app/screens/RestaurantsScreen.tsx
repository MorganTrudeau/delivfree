import { Screen, Text } from "app/components";
import AnimatedHeaderTitle from "app/components/AnimatedHeaderTitle";
import RestaurantsList from "app/components/RestaurantsList";
import {
  $image,
  $imageContainer,
  $screen,
  HORIZONTAL_SAFE_AREA_EDGES,
} from "app/components/styles";
import { useRestaurantsLoading } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import { getCuisineImage, getCuisineTitle } from "app/utils/cuisines";
import { Restaurant } from "functions/src/types";
import React, { useCallback, useEffect, useMemo } from "react";
import { TextStyle, View } from "react-native";
import FastImage from "react-native-fast-image";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RestaurantsScreenProps extends AppStackScreenProps<"Restaurants"> {}

export const RestaurantsScreen = ({
  navigation,
  route,
}: RestaurantsScreenProps) => {
  const { cuisine } = route.params;

  const insets = useSafeAreaInsets();

  const { restaurants, loadRestaurants } = useRestaurantsLoading(
    route.params.cuisine
  );

  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <AnimatedHeaderTitle
          title={getCuisineTitle(cuisine)}
          scrollY={scrollY}
        />
      ),
    });
  }, [navigation, route.params.cuisine]);

  const listContent = useMemo(
    () => ({
      paddingBottom: spacing.sm + insets.bottom,
      paddingHorizontal: spacing.md,
    }),
    [insets.bottom]
  );

  const handleRestaurantPress = useCallback(
    (restaurant: Restaurant) =>
      navigation.navigate("RestaurantDetail", { restaurantId: restaurant.id }),
    [navigation]
  );

  const renderListHeader = useMemo(
    () => (
      <View>
        <Text preset={"heading"} style={$heading}>
          {getCuisineTitle(cuisine)}
        </Text>
      </View>
    ),
    [cuisine]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={{ maxWidth: 400 }}>
        <View style={$imageContainer}>
          <FastImage source={getCuisineImage(cuisine)} style={$image} />
        </View>
        <Text preset={"subheading"} style={$emptyText}>
          Coming Soon in your area!
        </Text>
      </View>
    ),
    []
  );

  return (
    <Screen
      safeAreaEdges={HORIZONTAL_SAFE_AREA_EDGES}
      contentContainerStyle={$screen}
    >
      <RestaurantsList
        restaurants={restaurants}
        loadMore={loadRestaurants}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={listContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshing={false}
        onPress={handleRestaurantPress}
        ListEmptyComponent={ListEmptyComponent}
      />
    </Screen>
  );
};

const $heading: TextStyle = { marginBottom: spacing.md };
const $emptyText: TextStyle = { marginTop: spacing.sm, textAlign: "center" };
