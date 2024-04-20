import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";
import { Stripe } from "stripe";
import { Driver, Vendor } from "functions/src/types";

const Stack = getStackNavigator();

export const renderDriverMainStack = ({
  subscription,
  driver,
  vendor,
}: {
  subscription: Stripe.Subscription | null | undefined;
  driver: Driver | null | undefined;
  vendor: Vendor | null | undefined;
}) => {
  if (!driver) {
    return <Stack.Screen name="Loading" component={Screens.LoadingScreen} />;
  }

  if (!driver.vendors?.length) {
    return (
      <Stack.Screen name="DriverCode" component={Screens.DriverCodeScreen} />
    );
  }

  if (
    !subscription ||
    !["active", "incomplete"].includes(subscription.status)
  ) {
    return (
      <Stack.Screen
        name="Subscription"
        component={Screens.DriverSubscriptionScreen}
        initialParams={{ locked: true }}
      />
    );
  }

  return (
    <>
      <Stack.Screen name="Home" component={Screens.VendorHomeScreen} />
      <Stack.Screen name="Orders" component={Screens.VendorOrdersScreen} />
      <Stack.Screen name="Profile" component={Screens.VendorProfileScreen} />
      <Stack.Screen
        name="Locations"
        component={Screens.VendorLocationsScreen}
      />
      <Stack.Screen name="Drivers" component={Screens.VendorDriversScreen} />
      <Stack.Screen
        name="Subscription"
        component={Screens.DriverSubscriptionScreen}
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
