import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Cuisine } from "delivfree";

export type AppStackParamList = {
  Welcome: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  Tabs: undefined;
  EditProfile: undefined;
  Settings: undefined;
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
};

const _stack = createNativeStackNavigator<AppStackParamList>();
export function getStackNavigator() {
  return _stack;
}
