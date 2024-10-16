import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";
import { User } from "delivfree";
import React from "react";

const Stack = getStackNavigator();

export const renderVendorRegistrationStack = ({
  user,
}: {
  user: User | null | undefined;
}) => {
  const hasSelectedRole = !!user?.vendor || !!user?.driver;
  return (
    <>
      {!hasSelectedRole && (
        <Stack.Screen
          name="VendorDriverSelect"
          component={Screens.VendorDriverSelectScreen}
        />
      )}
      {(!hasSelectedRole || user?.vendor) && (
        <Stack.Screen
          name="VendorRegistration"
          component={Screens.EditVendorProfileScreen}
        />
      )}
      {(!hasSelectedRole || user?.driver) && (
        <Stack.Screen
          name="DriverRegistration"
          component={Screens.EditDriverProfileScreen}
        />
      )}
    </>
  );
};
