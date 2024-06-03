import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { $fontSizeStyles } from "app/components";
import { colors, typography } from "app/theme";
import { Cuisine } from "delivfree";
import { Platform } from "react-native";
import { StackAnimationTypes } from "react-native-screens";

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
};

export const screenOptions = {
  headerBackTitleVisible: false,
  headerShown: false,
  headerTintColor: colors.primary,
  headerTitleStyle: [
    { fontFamily: typography.secondary.semiBold, color: colors.text },
    $fontSizeStyles.lg,
  ],
  navigationBarColor: colors.background,
  headerTitle: "",
  headerTransparent: true,
  headerStyle: { backgroundColor: colors.background },
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
