import React from "react";
import { useAppSelector } from "app/redux/store";
import { isUserRegistered } from "app/utils/user";
import { getStackNavigator, screenOptions } from "../StackNavigator";
import { renderAuthStack } from "../AuthStack";
import { renderRegistrationStack } from "../RegistrationStack";
import * as Screens from "app/screens";
import { Platform } from "react-native";
import { DrawerIconButton } from "app/components/DrawerIconButton";

const Stack = getStackNavigator();

export const ConsumerStack = () => {
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
        <Stack.Screen
          name="Home"
          component={Screens.HomeScreen}
          options={{
            headerLeft: () => <DrawerIconButton />,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Screens.SettingsScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="AddressSearch"
          component={Screens.AddressSearchScreen}
          options={{ headerRight: undefined }}
        />
        <Stack.Screen
          name="Restaurants"
          component={Screens.RestaurantsScreen}
        />
        <Stack.Screen
          name="Checkout"
          component={Screens.CheckoutScreen}
          options={{ headerRight: undefined }}
        />
        <Stack.Screen
          name="Payment"
          component={Screens.PaymentScreen}
          options={{ headerRight: undefined }}
        />
        <Stack.Screen
          name="RestaurantDetail"
          component={Screens.RestaurantDetailScreen}
          options={Platform.select({
            web: {},
            default: {
              headerShown: false,
            },
          })}
        />
        <Stack.Screen
          name="CheckoutCart"
          component={Screens.CheckoutCartScreen}
          options={{ headerRight: undefined }}
        />
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
      <Stack.Screen
        name="ConsumerTermsAndConditions"
        component={Screens.ConsumerTermsScreen}
        options={{ headerRight: undefined }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={Screens.PrivacyPolicyScreen}
        options={{ headerRight: undefined }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={Screens.ForgotPasswordScreen}
        options={{ headerRight: undefined }}
      />
      <Stack.Screen
        name="WebView"
        component={Screens.WebViewScreen}
        options={{ headerRight: undefined }}
      />
    </Stack.Navigator>
  );
};
