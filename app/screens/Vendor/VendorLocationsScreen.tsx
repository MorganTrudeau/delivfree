import { Icon, Screen, Text } from "app/components";
import { ButtonSmall } from "app/components/ButtonSmall";
import { Drawer } from "app/components/Drawer";
import RestaurantsList from "app/components/RestaurantsList";
import { $containerPadding, $row, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import { RestaurantLocation } from "functions/src/types";
import React, { useMemo } from "react";
import { View, ViewStyle } from "react-native";

interface VendorLocationsScreenProps extends AppStackScreenProps<"Locations"> {}

const LOCATIONS: RestaurantLocation[] = [
  {
    id: "a",
    longitude: 0,
    latitude: 0,
    address: "20159 88 Ave c102, Langley Twp, BC V1M 0A4",
    geohash: "",
    cuisines: ["pizza"],
    keywords: ["pizza"],
    restaurantId: "phut",
    phoneNumber: "778-808-9036",
    name: "Pizza Hut Langley",
    menuLink: "",
    orderLink: "",
    image:
      "https://api.pizzahut.io/v1/content/en-ca/ca-1/images/pizza/pizza.supreme-lovers.3706cdc20b0752ac212c0d68a310fb18.1.jpg",
  },
  {
    id: "a",
    longitude: 0,
    latitude: 0,
    address: "11939 240 St #140, Maple Ridge, BC V4R 1M7",
    geohash: "",
    cuisines: ["pizza"],
    keywords: ["pizza"],
    restaurantId: "phut",
    phoneNumber: "778-808-9036",
    name: "Pizza Hut Maple Ridge",
    menuLink: "",
    orderLink: "",
    image:
      "https://recipes.net/wp-content/uploads/2024/02/what-is-dominos-bbq-pizza-1707720386.jpg",
  },
];

export const VendorLocationsScreen = (props: VendorLocationsScreenProps) => {
  const PlusIcon = useMemo(
    () =>
      ({ style }) =>
        <Icon icon="plus" color={"#fff"} style={style} />,
    []
  );
  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <View style={[$row, { justifyContent: "space-between" }]}>
          <Text preset="heading">Locations</Text>
          <ButtonSmall
            LeftAccessory={PlusIcon}
            text={"Add Location"}
            preset="filled"
          />
        </View>
        <RestaurantsList
          restaurants={LOCATIONS}
          style={$list}
          contentContainerStyle={$listContent}
        />
      </Screen>
    </Drawer>
  );
};

const $list: ViewStyle = { marginHorizontal: -spacing.md };
const $listContent: ViewStyle = {
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md * 2,
};
