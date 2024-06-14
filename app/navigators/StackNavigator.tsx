import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { $fontSizeStyles } from "app/components";
import { DrawerIconButton } from "app/components/DrawerIconButton";
import { LogoHeader } from "app/components/LogoHeader";
import { colors, spacing, typography } from "app/theme";
import { Cuisine } from "delivfree";
import { Platform, View } from "react-native";
import { StackAnimationTypes } from "react-native-screens";
import { navigationRef } from "./navigationUtilities";
import { CheckoutCartTracker } from "app/components/CheckoutCart/CheckoutCartTracker";

export type AppStackParamList = {
  Welcome: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  Tabs: undefined;
  EditProfile: undefined;
  Settings: undefined | { drawer?: boolean };
  About: undefined;
  DeleteAccount: undefined;
  Home: undefined;
  Restaurants: { cuisine: Cuisine };
  RestaurantDetail: { restaurantId: string };
  EditVendorProfile: undefined;
  EditDriverProfile: undefined;
  VendorDriverSelect: undefined;
  Orders: undefined;
  Profile: undefined;
  Subscription: { locked?: true };
  StartSubscription: { locked?: true };
  Locations: undefined;
  AddressSearch: undefined;
  Drivers: undefined;
  Loading: undefined;
  DriverCode: undefined;
  DriverRegistration: undefined;
  VendorRegistration: undefined;
  Positions: undefined;
  Users: undefined;
  Vendors: undefined;
  VendorDetail: { vendor: string };
  DriverDetail: { driver: string };
  AdConfig: undefined;
  PositionsSearch: undefined;
  Licenses: undefined;
  Menus: { tab?: string };
  Checkout: undefined;
};

export const linkingConfigScreens: {
  [Property in keyof AppStackParamList]?: string;
} = {
  Home: "home",
  Orders: "orders",
  Profile: "profile",
  Drivers: "drivers",
  Positions: "positions",
  Users: "users",
  Vendors: "vendors",
  VendorDetail: "vendor-detail",
  DriverDetail: "driver-detail",
  AdConfig: "ad-config",
  PositionsSearch: "positions-search",
  Menus: "menus",
  RestaurantDetail: "restaurant-menu",
  Checkout: "checkout",
};

export const screenOptions = {
  headerBackTitleVisible: false,
  headerLeft: () => <DrawerIconButton />,
  headerRight: () => (
    <View style={{ paddingHorizontal: spacing.md }}>
      <CheckoutCartTracker />
    </View>
  ),
  headerTitle: () => (
    <LogoHeader onPress={() => navigationRef.current?.navigate("Home")} />
  ),
  headerTintColor: colors.primary,
  headerTitleStyle: [
    { fontFamily: typography.secondary.semiBold, color: colors.text },
    $fontSizeStyles.lg,
  ],
  navigationBarColor: colors.background,
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerShadowVisible: false,
  animation: Platform.select<StackAnimationTypes>({
    android: "fade_from_bottom",
    default: "default",
  }),
  animationDuration: 100,
};

const _stack = createNativeStackNavigator<AppStackParamList>();
export function getStackNavigator() {
  return _stack;
}
