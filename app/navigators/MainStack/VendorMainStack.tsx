import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";
import { Stripe } from "stripe";
import { Vendor } from "delivfree";
import React from "react";

const Stack = getStackNavigator();

export const renderVendorMainStack = ({
  vendorSubscription,
  vendor,
}: {
  vendorSubscription: Stripe.Subscription | null | undefined;
  vendor: Vendor | null | undefined;
}) => {
  if (vendorSubscription === undefined) {
    return <Stack.Screen name="Loading" component={Screens.LoadingScreen} />;
  }

  if (vendor?.registration?.status !== "approved") {
    return (
      <Stack.Screen
        name="VendorRegistration"
        component={Screens.EditVendorProfileScreen}
        options={{
          headerShown: true,
          headerTransparent: false,
        }}
      />
    );
  }

  if (
    !vendorSubscription ||
    !["active", "incomplete"].includes(vendorSubscription.status)
  ) {
    return (
      <Stack.Screen
        name="StartSubscription"
        component={Screens.VendorSubscriptionScreen}
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
