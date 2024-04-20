import { Screen, Text } from "app/components";
import { AdBanner } from "app/components/AdBanner";
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
import { RestaurantLocation, Vendor } from "delivfree";
import React, { useCallback, useEffect, useMemo } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
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
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: () => (
  //       <AnimatedHeaderTitle
  //         title={getCuisineTitle(cuisine)}
  //         scrollY={scrollY}
  //       />
  //     ),
  //   });
  // }, [navigation, route.params.cuisine]);

  const listContent = useMemo(
    () => ({
      paddingBottom: spacing.sm + insets.bottom,
      paddingHorizontal: spacing.md,
    }),
    [insets.bottom]
  );

  const handleRestaurantPress = useCallback(
    (restaurant: RestaurantLocation) =>
      navigation.navigate("RestaurantDetail", { restaurantId: restaurant.id }),
    [navigation]
  );

  const renderListHeader = useMemo(
    () => (
      <View style={$listHeader}>
        <Text preset={"heading"} style={$heading}>
          {getCuisineTitle(cuisine)}
        </Text>
        <AdBanner type={cuisine} style={$adBanner} />
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

const $heading: TextStyle = {};
const $listHeader: ViewStyle = { paddingBottom: spacing.md };
const $emptyText: TextStyle = { marginTop: spacing.sm, textAlign: "center" };
const $adBanner: ImageStyle = {
  marginTop: spacing.sm,
  marginBottom: spacing.md,
};
