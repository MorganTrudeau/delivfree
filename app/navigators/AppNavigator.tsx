import {
  NavigationContainer,
  NavigationProp as NativeNavigationProp,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import * as Screens from "app/screens";
import Config from "../config";
import { navigationRef, useBackButtonHandler } from "./navigationUtilities";
import { colors, typography } from "app/theme";
import { TabNavigator, TabParamList } from "./TabNavigator";
import { GameType, TriviaCategory, TriviaResults } from "smarticus";
import { FirebaseMessaging } from "app/services/firebase/messaging";
import { useAppSelector } from "app/redux/store";
import RNBootSplash from "react-native-bootsplash";
import { $fontSizeStyles } from "app/components";
import { rateApp, shouldAskRating } from "app/utils/rate";
import { Platform } from "react-native";
import { StackAnimationTypes } from "react-native-screens";
import { useAdMob } from "app/hooks";

export type AppStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Tabs: undefined;
  Game: {
    category?: TriviaCategory | "random";
    gameType: GameType;
    dailyTriviaDate?: string;
  };
  Challenge: {
    challengeId: string;
  };
  Category: { gameType: GameType };
  Versus: undefined;
  Results: {
    category?: TriviaCategory | "random";
    gameType: GameType;
    results: TriviaResults[];
    challengeUser?: string;
  };
  StartChallenge: { userId?: string; challengeId?: string };
  AcceptChallenge: { challengeId: string };
  EditProfile: undefined;
  DailyTrivia: undefined;
  QuestionApproval: undefined;
  Settings: undefined;
  About: undefined;
  DeleteAccount: undefined;
  BlockedUsers: undefined;
  IncomingChallenges: undefined;
  ActiveChallenges: undefined;
  OutgoingChallenges: undefined;
};

export type NavigationProp = NativeNavigationProp<
  AppStackParamList & TabParamList
>;

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const { user, authToken, userLoaded, deleteAccountLoading } = useAppSelector(
    (state) => ({
      user: state.user.user,
      userLoaded: state.user.loaded,
      authToken: state.auth.authToken,
      deleteAccountLoading: state.user.deleteAccountLoading,
    })
  );

  return (
    <Stack.Navigator
      screenOptions={{
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
      }}
      initialRouteName={
        authToken ? (userLoaded ? "Tabs" : "EditProfile") : "Welcome"
      }
    >
      {!!authToken && userLoaded ? (
        user || deleteAccountLoading ? (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} />
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
        ) : (
          <>
            <Stack.Screen
              name="EditProfile"
              component={Screens.EditUserScreen}
            />
          </>
        )
      ) : (
        <>
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          <Stack.Screen
            name="SignUp"
            component={Screens.SignUpScreen}
            options={{
              headerShown: true,
              headerRight: () => null,
              headerTransparent: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Screens.LoginScreen}
            options={{
              headerShown: true,
              headerRight: () => null,
              headerTransparent: false,
            }}
          />
        </>
      )}
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
      <AppStack />
      <FirebaseMessaging />
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
