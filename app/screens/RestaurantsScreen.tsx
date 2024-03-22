import { Screen, Text } from "app/components";
import RestaurantsList from "app/components/RestaurantsList";
import {
  $containerPadding,
  $image,
  $imageContainer,
  $screen,
  HORIZONTAL_SAFE_AREA_EDGES,
} from "app/components/styles";
import { useRestaurantsLoading } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import { getCuisineImage, getCuisineTitle } from "app/utils/cuisines";
import React, { useCallback, useEffect, useMemo } from "react";
import { TextStyle, View } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";

interface RestaurantsScreenProps extends AppStackScreenProps<"Restaurants"> {}

export const RestaurantsScreen = ({
  navigation,
  route,
}: RestaurantsScreenProps) => {
  const { cuisine } = route.params;

  const { restaurants, loadRestaurants } = useRestaurantsLoading(
    route.params.cuisine
  );

  //   useEffect(() => {
  //     navigation.setOptions({
  //       headerTitle: getCuisineTitle(route.params.cuisine),
  //     });
  //   }, [navigation, route.params.cuisine]);

  const renderListHeader = useMemo(
    () => (
      <View>
        <View style={$imageContainer}>
          <FastImage source={getCuisineImage(cuisine)} style={$image} />
        </View>
        <Text preset={"heading"} style={$heading}>
          {getCuisineTitle(cuisine)}
        </Text>
      </View>
    ),
    [cuisine]
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
      />
    </Screen>
  );
};

const $heading: TextStyle = { marginTop: spacing.xs, marginBottom: spacing.md };
