import { Icon, Screen, Text } from "app/components";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { $flexShrink, $screen } from "app/components/styles";
import CuisineList from "app/components/Cuisines/CuisineList";
import { ActivityIndicator, Pressable, View, ViewStyle } from "react-native";
import { colors, spacing } from "app/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "app/components/TextInput";
import { AppStackScreenProps } from "app/navigators";
import { Cuisine, VendorLocation } from "delivfree";
import LocationModal from "app/components/Modal/LocationModal";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { useAppSelector } from "app/redux/store";
import { useDebounce } from "app/hooks";
import { fetchVendorLocations } from "app/apis/vendorLocations";
import { sizing } from "app/theme/sizing";
import { ImageStyle } from "react-native-fast-image";
import { AdBanner } from "app/components/AdBanner";
import { useIsFocused } from "@react-navigation/native";

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen = (props: HomeScreenProps) => {
  const insets = useSafeAreaInsets();

  const activeUser = useAppSelector((state) => state.user.user);

  const locationModal = useRef<BottomSheetRef>(null);
  const closeLocationModal = useCallback(
    () => locationModal.current?.close(),
    []
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !activeUser?.location) {
      setTimeout(() => locationModal.current?.snapToIndex(0), 200);
    } else {
      locationModal.current?.close();
    }
  }, [activeUser?.location, isFocused]);

  const listContent = useMemo(
    () => ({
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md + insets.bottom,
    }),
    [insets.bottom]
  );

  const navigateToCuisine = useCallback(
    (cuisine: Cuisine) => {
      props.navigation.navigate("Restaurants", { cuisine });
    },
    [props.navigation]
  );

  const navigateToRestaurant = useCallback(
    (restaurant: VendorLocation) =>
      props.navigation.navigate("RestaurantDetail", {
        restaurantId: restaurant.id,
      }),
    [props.navigation]
  );

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<VendorLocation[]>([]);

  const debounce = useDebounce(300);

  const searchRestaurants = debounce(async (query: string) => {
    setSearchLoading(true);
    const _restaurants = await fetchVendorLocations(
      {
        latitude: activeUser?.location?.latitude as number,
        longitude: activeUser?.location?.longitude as number,
      },
      { keyword: query }
    );
    setRestaurants(_restaurants);
    setSearchLoading(false);
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value) {
      searchRestaurants(value);
    } else {
      setRestaurants([]);
    }
  };

  const ListHeader = useMemo(
    () => (
      <View style={$listHeader}>
        {!!activeUser?.location?.address && (
          <Pressable
            style={$location}
            onPress={() => locationModal.current?.snapToIndex(0)}
          >
            <Text style={$flexShrink}>{activeUser?.location?.address}</Text>
            <Icon icon={"chevron-down"} />
          </Pressable>
        )}
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder={"Search restaurants"}
          style={$search}
        />
        <AdBanner type={"general"} style={$adBanner} />
      </View>
    ),
    [search, activeUser?.location?.address]
  );

  const EmptySearch = useMemo(() => {
    return !searchLoading ? (
      <View style={$emptyList}>
        <Icon icon={"magnify"} size={sizing.xxl} style={$emptyIcon} />
        <Text>No results for "{search}"</Text>
      </View>
    ) : (
      <ActivityIndicator size={"small"} color={colors.text} />
    );
  }, [searchLoading, search]);

  return (
    <Screen contentContainerStyle={$screen}>
      <CuisineList
        contentContainerStyle={listContent}
        onCuisinePress={navigateToCuisine}
        onRestaurantPress={navigateToRestaurant}
        ListHeaderComponent={ListHeader}
        restaurants={restaurants}
        showRestaurants={!!search}
        ListEmptyComponent={EmptySearch}
      />
      <LocationModal ref={locationModal} onRequestClose={closeLocationModal} />
    </Screen>
  );
};

const $search: ViewStyle = {
  marginTop: spacing.sm,
  maxWidth: 700,
};
const $location: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const $emptyList: ViewStyle = {
  alignSelf: "center",
  alignItems: "center",
};
const $emptyIcon: ViewStyle = { marginBottom: spacing.xs };
const $adBanner: ImageStyle = { marginTop: spacing.md };
const $listHeader: ViewStyle = { paddingBottom: spacing.xl };
