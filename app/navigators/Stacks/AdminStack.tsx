import React from "react";
import { useAppSelector } from "app/redux/store";
import { isUserRegistered } from "app/utils/user";
import { getStackNavigator, screenOptions } from "../StackNavigator";
import { renderAuthStack } from "../AuthStack";
import { renderRegistrationStack } from "../RegistrationStack";
import * as Screens from "app/screens";

const Stack = getStackNavigator();

export const AdminStack = () => {
  const { user, authToken, userLoaded, deleteAccountLoading } = useAppSelector(
    (state) => ({
      user: state.user.user,
      userLoaded: state.user.loaded,
      authToken: state.auth.authToken,
      deleteAccountLoading: state.user.deleteAccountLoading,
    })
  );

  const registered = isUserRegistered(user);

  const renderMainStack = () => {
    return (
      <>
        <Stack.Screen name="Vendors" component={Screens.AdminVendorsScreen} />
        <Stack.Screen name="Drivers" component={Screens.AdminDriversScreen} />
        <Stack.Screen name="Users" component={Screens.AdminUsersScreen} />
        <Stack.Screen name="AdConfig" component={Screens.AdConfigScreen} />
        <Stack.Screen
          name="VendorDetail"
          component={Screens.VendorDetailScreen}
        />
        <Stack.Screen
          name="DriverDetail"
          component={Screens.DriverDetailScreen}
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
