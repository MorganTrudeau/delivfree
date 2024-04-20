import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import Config from "../config";
import { navigationRef, useBackButtonHandler } from "./navigationUtilities";
import { colors, typography } from "app/theme";
import { FirebaseMessaging } from "app/services/firebase/messaging";
import { useAppSelector } from "app/redux/store";
import RNBootSplash from "react-native-bootsplash";
import { $fontSizeStyles } from "app/components";
import { rateApp, shouldAskRating } from "app/utils/rate";
import { Platform } from "react-native";
import { StackAnimationTypes } from "react-native-screens";
import { AppStackParamList, getStackNavigator } from "./StackNavigator";
import { renderAuthStack } from "./AuthStack";
import { renderMainStack } from "./MainStack";
import { renderRegistrationStack } from "./RegistrationStack";
import { isUserRegistered } from "app/utils/user";
import { UserTypeManager } from "app/services/UserTypeManager";
import { Host as PortalHost } from "react-native-portalize";
import AlertProvider from "app/components/Alert/AlertContext";
import DataLoadingManager from "app/services/DataLoadingManager";

export type NavigationProp = AppStackScreenProps<
  keyof AppStackParamList
>["navigation"];

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

const Stack = getStackNavigator();

const screenOptions = {
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

const AppStack = () => {
  const {
    user,
    vendor,
    driver,
    authToken,
    userLoaded,
    deleteAccountLoading,
    subscription,
    userType,
  } = useAppSelector((state) => ({
    user: state.user.user,
    userLoaded: state.user.loaded,
    authToken: state.auth.authToken,
    deleteAccountLoading: state.user.deleteAccountLoading,
    vendor: state.vendor.data,
    driver: state.driver.data,
    subscription: state.subscription.data,
    userType: state.appConfig.userType,
  }));

  const registered = isUserRegistered(user, vendor, driver);

  const renderStack = () => {
    if (!(authToken && userLoaded)) {
      return renderAuthStack();
    }
    if (!(registered || deleteAccountLoading)) {
      return renderRegistrationStack({ user });
    }
    return renderMainStack({ subscription, userType, driver, vendor });
  };

  const initialRouteName = authToken
    ? userLoaded
      ? "Home"
      : "EditProfile"
    : "Welcome";

  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={initialRouteName}
    >
      {renderStack()}
    </Stack.Navigator>
  );
};

export interface NavigationProps
  extends Partial<
    React.ComponentProps<typeof NavigationContainer<AppStackParamList>>
  > {}

const onReady = () => setTimeout(() => RNBootSplash.hide({ fade: true }), 10);

export const AppNavigator = (props: NavigationProps) => {
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  useEffect(() => {
    const handleRateApp = async () => {
      const askRating = await shouldAskRating();
      if (askRating) {
        rateApp(true);
      }
    };

    handleRateApp();
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={Theme}
      onReady={onReady}
      {...props}
    >
      <PortalHost>
        <AlertProvider>
          <PortalHost>
            <AppStack />
          </PortalHost>
        </AlertProvider>
      </PortalHost>
      <FirebaseMessaging />
      <UserTypeManager />
      <DataLoadingManager />
    </NavigationContainer>
  );
};

const Theme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};
