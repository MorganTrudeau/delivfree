import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";

const Stack = getStackNavigator();

export const renderVendorMainStack = () => {
  return (
    <>
      <Stack.Screen name="Home" component={Screens.VendorHomeScreen} />
      <Stack.Screen name="Orders" component={Screens.VendorOrdersScreen} />
      <Stack.Screen name="Profile" component={Screens.VendorProfileScreen} />
      <Stack.Screen
        name="Locations"
        component={Screens.VendorLocationsScreen}
      />
      <Stack.Screen
        name="Subscription"
        component={Screens.VendorSubscriptionScreen}
      />
      <Stack.Screen
        name="Settings"
        component={Screens.SettingsScreen}
        options={{
          headerShown: true,
          headerTransparent: false,
          headerTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="About"
        component={Screens.AboutScreen}
        options={{
          headerShown: true,
          headerTransparent: false,
          headerTitle: "About",
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={Screens.DeleteAccountScreen}
        options={{
          headerShown: true,
          headerTransparent: false,
        }}
      />
    </>
  );
};
