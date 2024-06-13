import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import Config from "../config";
import { navigationRef, useBackButtonHandler } from "./navigationUtilities";
import { colors } from "app/theme";
import { FirebaseMessaging } from "app/services/firebase/messaging";
import RNBootSplash from "react-native-bootsplash";
import { rateApp, shouldAskRating } from "app/utils/rate";
import { Platform } from "react-native";
import { AppStackParamList, linkingConfigScreens } from "./StackNavigator";
import { UserTypeManager } from "app/services/UserTypeManager";
import { Host as PortalHost } from "react-native-portalize";
import AlertProvider from "app/components/Alert/AlertContext";
import { DataLoadingManager } from "app/services/DataLoadingManager";
import ToastProvider from "app/components/Toast/ToastContext";
import { getAppType } from "app/utils/general";
import { AdminStack } from "./Stacks/AdminStack";
import { VendorStack } from "./Stacks/VendorStack";
import { ConsumerStack } from "./Stacks/ConsumerStack";
import { Drawer } from "app/components/Drawer";

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

const appType = getAppType();

const AppStack = () => {
  if (appType === "ADMIN") {
    return <AdminStack />;
  } else if (appType === "VENDOR") {
    return <VendorStack />;
  } else {
    return <ConsumerStack />;
  }
};

const config = {
  screens: linkingConfigScreens,
};

const linking = {
  prefixes: [],
  config,
};

export interface NavigationProps
  extends Partial<
    React.ComponentProps<typeof NavigationContainer<AppStackParamList>>
  > {}

const onReadyMobile = () =>
  setTimeout(() => RNBootSplash.hide({ fade: true }), 10);
const onReadyWeb = undefined;
const onReady = Platform.select({ web: onReadyWeb, default: onReadyMobile });

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
      linking={linking}
      {...props}
    >
      <PortalHost>
        <ToastProvider>
          <AlertProvider>
            <PortalHost>
              <Drawer navigation={navigationRef}>
                <AppStack />
              </Drawer>
            </PortalHost>
          </AlertProvider>
        </ToastProvider>
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
