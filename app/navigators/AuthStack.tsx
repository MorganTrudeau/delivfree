import React from "react";
import * as Screens from "app/screens";
import { getStackNavigator } from "./StackNavigator";

const Stack = getStackNavigator();

export const renderAuthStack = () => (
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
    <Stack.Screen
      name="ForgotPassword"
      component={Screens.ForgotPasswordScreen}
      options={{
        headerShown: true,
        headerTransparent: false,
      }}
    />
  </>
);
