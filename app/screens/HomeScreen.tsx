import { Icon, Screen, Text } from "app/components";
import { Drawer } from "app/components/Drawer";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HORIZONTAL_SAFE_AREA_EDGES } from "app/components/styles";
import CuisineList from "app/components/Cuisines/CuisineList";
import { Pressable, ViewStyle } from "react-native";
import { spacing } from "app/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "app/components/TextInput";
import { AppStackScreenProps } from "app/navigators";
import { Cuisine } from "functions/src/types";
import LocationModal from "app/components/Modal/LocationModal";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { useAppSelector } from "app/redux/store";

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen = (props: HomeScreenProps) => {
  const insets = useSafeAreaInsets();

  const activeUser = useAppSelector((state) => state.user.user);

  const locationModal = useRef<BottomSheetRef>(null);
  const closeLocationModal = useCallback(
    () => locationModal.current?.close(),
    []
  );

  useEffect(() => {
    if (!activeUser?.location) {
      setTimeout(() => locationModal.current?.snapToIndex(0), 200);
    } else {
      locationModal.current?.close();
    }
  }, [activeUser?.location]);

  const listContent = useMemo(
    () => ({
      paddingBottom: spacing.sm + insets.bottom,
    }),
    [insets.bottom]
  );
  const [search, setSearch] = useState("");
  const navigateToCuisine = useCallback(
    (cuisine: Cuisine) => {
      props.navigation.navigate("Restaurants", { cuisine });
    },
    [props.navigation]
  );
  const renderListHeader = useCallback(
    () => (
      <>
        <Text preset={"heading"}>DELIVFREE</Text>
        {!!activeUser?.location?.address && (
          <Pressable
            style={$location}
            onPress={() => locationModal.current?.snapToIndex(0)}
          >
            <Text>{activeUser?.location?.address}</Text>
            <Icon icon={"chevron-down"} />
          </Pressable>
        )}
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={"Search restaurants"}
          style={$search}
        />
      </>
    ),
    [search, activeUser?.location?.address]
  );
  return (
    <Drawer navigation={props.navigation}>
      <Screen
        safeAreaEdges={HORIZONTAL_SAFE_AREA_EDGES}
        inDrawer
        contentContainerStyle={$screen}
      >
        <CuisineList
          contentContainerStyle={listContent}
          onPress={navigateToCuisine}
          ListHeaderComponent={renderListHeader}
        />
        <LocationModal
          ref={locationModal}
          onRequestClose={closeLocationModal}
        />
      </Screen>
    </Drawer>
  );
};

const $screen = { flex: 1, paddingHorizontal: spacing.md };
const $search: ViewStyle = { marginBottom: spacing.lg };
const $location: ViewStyle = {
  marginVertical: spacing.xxs,
  flexDirection: "row",
  alignItems: "center",
};
