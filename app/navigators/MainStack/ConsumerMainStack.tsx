import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";
import { Pressable } from "react-native";
import { spacing } from "app/theme";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "app/components";
import React from "react";

const Stack = getStackNavigator();

export const renderConsumerMainStack = () => {
  const navigation = useNavigation();
  return (
    <>
      <Stack.Screen name="Home" component={Screens.HomeScreen} />
      <Stack.Screen
        name="AddressSearch"
        component={Screens.AddressSearchScreen}
        options={{
          headerTitle: "Address Search",
          headerTransparent: false,
        }}
      />
      <Stack.Screen
        name="Restaurants"
        component={Screens.RestaurantsScreen}
        options={{
          headerTransparent: false,
        }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={Screens.RestaurantDetailScreen}
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          headerLeft: (props) =>
            props.canGoBack ? (
              <Pressable
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 100,
                  padding: spacing.xxs,
                }}
                onPress={() => navigation.goBack()}
              >
                <Icon icon={"arrow-left"} color={"#fff"} />
              </Pressable>
            ) : null,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Screens.SettingsScreen}
        options={{
          headerTransparent: false,
          headerTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="About"
        component={Screens.AboutScreen}
        options={{
          headerTransparent: false,
          headerTitle: "About",
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={Screens.DeleteAccountScreen}
        options={{
          headerTransparent: false,
        }}
      />
    </>
  );
};
