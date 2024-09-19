import React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { LogoHeader } from "app/components/LogoHeader";
import { colors, fontSize, spacing, typography } from "app/theme";
import { Platform, View } from "react-native";
import { StackAnimationTypes } from "react-native-screens";
import { navigationRef } from "./navigationUtilities";
import { CheckoutCartTracker } from "app/components/CheckoutCart/CheckoutCartTracker";
import { getAppType } from "app/utils/general";
import { NativeStackHeader } from "./Header/NativeStackHeader";
import { AppStackParamList } from "./AppStackParamList";

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
  PrivacyPolicy: "privacy-policy",
  Tips: "tips",
  ConsumerTermsAndConditions: "consumer-terms-and-conditions",
  VendorTermsAndConditions: "vendor-terms-and-conditions",
};

export const screenOptions: NativeStackNavigationOptions = {
  headerBackTitleVisible: false,
  headerRight:
    getAppType() === "CONSUMER"
      ? () => (
          <View
            style={{
              paddingHorizontal: Platform.select({
                web: spacing.md,
                default: 0,
              }),
            }}
          >
            <CheckoutCartTracker />
          </View>
        )
      : undefined,
  headerTitle: () => (
    <LogoHeader onPress={() => navigationRef.current?.navigate("Home")} />
  ),
  headerTintColor: colors.primary,
  headerTitleStyle: [
    { fontFamily: typography.secondary.semiBold, color: colors.text },
    fontSize.lg,
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
  header: NativeStackHeader,
};

const _stack = createNativeStackNavigator<AppStackParamList>();
export function getStackNavigator() {
  return _stack;
}
