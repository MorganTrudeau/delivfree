import React from "react";
import { useAppSelector } from "app/redux/store";
import { isUserRegistered } from "app/utils/user";
import { getStackNavigator, screenOptions } from "../StackNavigator";
import { renderAuthStack } from "../AuthStack";
import { renderRegistrationStack } from "../RegistrationStack";
import * as Screens from "app/screens";
import { LogoHeader } from "app/components/LogoHeader";
import { Platform, Pressable } from "react-native";
import { spacing } from "app/theme";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "app/components";
import { DrawerIconButton } from "app/components/DrawerIconButton";

const Stack = getStackNavigator();

export const ConsumerStack = () => {
  const navigation = useNavigation();

  const { user, authToken, userLoaded, deleteAccountLoading } = useAppSelector(
    (state) => ({
      user: state.user.user,
      authToken: state.auth.authToken,
      userLoaded: state.user.loaded,
      deleteAccountLoading: state.user.deleteAccountLoading,
    })
  );

  const registered = isUserRegistered(user);

  const renderMainStack = () => {
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
            headerTransparent: Platform.OS !== "web",
            headerStyle: { backgroundColor: "transparent" },
            headerLeft:
              Platform.OS === "web"
                ? () => <DrawerIconButton />
                : (props) =>
                    props.canGoBack ? (
                      <Pressable
                        style={{
                          backgroundColor: "rgba(0,0,0,0.5)",
                          borderRadius: 100,
                          padding: spacing.xxs,
                          marginLeft: Platform.OS === "web" ? spacing.md : 0,
                        }}
                        onPress={() => navigation.goBack()}
                      >
                        <Icon icon={"arrow-left"} color={"#fff"} />
                      </Pressable>
                    ) : null,
          }}
        />
        <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
        <Stack.Screen name="About" component={Screens.AboutScreen} />
        <Stack.Screen
          name="DeleteAccount"
          component={Screens.DeleteAccountScreen}
        />
      </>
    );
  };

  const renderStack = () => {
    if (!(authToken && userLoaded)) {
      return renderAuthStack();
    }

    if (!(registered || deleteAccountLoading)) {
      return renderRegistrationStack({ user });
    }

    return renderMainStack();
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {renderStack()}
    </Stack.Navigator>
  );
};
