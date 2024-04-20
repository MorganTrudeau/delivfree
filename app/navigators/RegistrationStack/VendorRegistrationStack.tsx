import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";
import { User } from "functions/src/types";

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
          options={{
            headerShown: true,
            headerTransparent: false,
          }}
        />
      )}
      {(!hasSelectedRole || user?.vendor) && (
        <Stack.Screen
          name="EditVendorProfile"
          component={Screens.EditVendorProfileScreen}
          options={{
            headerShown: true,
            headerTransparent: false,
          }}
        />
      )}
      {(!hasSelectedRole || user?.driver) && (
        <Stack.Screen
          name="EditDriverProfile"
          component={Screens.EditDriverProfileScreen}
          options={{
            headerShown: true,
            headerTransparent: false,
          }}
        />
      )}
    </>
  );
};
