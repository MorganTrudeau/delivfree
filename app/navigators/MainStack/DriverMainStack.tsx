import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";
import { Stripe } from "stripe";
import { Driver, Vendor } from "functions/src/types";

const Stack = getStackNavigator();

export const renderDriverMainStack = ({
  vendorSubscription,
  driverSubscription,
  driver,
  vendor,
}: {
  vendorSubscription: Stripe.Subscription | null | undefined;
  driverSubscription: Stripe.Subscription | null | undefined;
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

  if (driver.registration.status !== "approved") {
    <Stack.Screen
      name="DriverRegistration"
      component={Screens.EditDriverProfileScreen}
      options={{
        headerShown: true,
        headerTransparent: false,
      }}
    />;
  }

  if (
    !driverSubscription ||
    !["active", "incomplete"].includes(driverSubscription.status)
  ) {
    return (
      <Stack.Screen
        name="StartSubscription"
        component={Screens.DriverSubscriptionScreen}
        initialParams={{ locked: true }}
      />
    );
  }

  return (
    <>
      <Stack.Screen name="Orders" component={Screens.DriverOrdersScreen} />
      <Stack.Screen name="Profile" component={Screens.DriverProfileScreen} />
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
