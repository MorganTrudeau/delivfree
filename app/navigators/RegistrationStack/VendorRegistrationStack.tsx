import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";

const Stack = getStackNavigator();

export const renderVendorRegistrationStack = () => (
  <>
    <Stack.Screen
      name="VendorDriverSelect"
      component={Screens.VendorDriverSelectScreen}
      options={{
        headerShown: true,
        headerTransparent: false,
      }}
    />
    <Stack.Screen
      name="EditVendorProfile"
      component={Screens.EditVendorProfileScreen}
      options={{
        headerShown: true,
        headerTransparent: false,
      }}
    />
    <Stack.Screen
      name="EditDriverProfile"
      component={Screens.EditDriverProfileScreen}
      options={{
        headerShown: true,
        headerTransparent: false,
      }}
    />
  </>
);
