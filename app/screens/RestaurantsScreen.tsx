import { Screen, Text } from "app/components";
import { AdBanner } from "app/components/AdBanner";
import RestaurantsList from "app/components/RestaurantsList";
import { $image, $imageContainer, $screen } from "app/components/styles";
import { useRestaurantsLoading } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { VendorLocation } from "delivfree";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native";
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

  const cuisines = useAppSelector((state) => state.cuisines.data);
  const cuisineData = useMemo(
    () => cuisines.find((c) => c.id === cuisine),
    [cuisine, cuisines]
  );

  const { restaurants, loadRestaurants, refreshRestaurants } =
    useRestaurantsLoading(route.params.cuisine);
  const loaded = restaurants !== undefined;

  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const listContent = useMemo(
    () => ({
      paddingBottom: spacing.md + insets.bottom,
      paddingHorizontal: spacing.md,
    }),
    [insets.bottom]
  );

  const handleRestaurantPress = useCallback(
    (restaurant: VendorLocation) =>
      navigation.navigate("RestaurantDetail", { restaurantId: restaurant.id }),
    [navigation]
  );

  const renderListHeader = useMemo(
    () => (
      <View style={$listHeader}>
        <Text preset={"heading"} style={$heading}>
          {cuisineData?.name}
        </Text>
        <AdBanner type={cuisine} style={$adBanner} />
      </View>
    ),
    [cuisine]
  );

  const ListEmptyComponent = useMemo(
    () =>
      loaded ? (
        <View style={{ maxWidth: 400 }}>
          <View style={$imageContainer}>
            <FastImage source={{ uri: cuisineData?.image }} style={$image} />
          </View>
          <Text preset={"subheading"} style={$emptyText}>
            Coming Soon in your area!
          </Text>
        </View>
      ) : (
        <ActivityIndicator color={colors.primary} />
      ),
    [loaded]
  );

  return (
    <Screen contentContainerStyle={$screen}>
      <RestaurantsList
        restaurants={restaurants}
        loadMore={loadRestaurants}
        onRefresh={refreshRestaurants}
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
