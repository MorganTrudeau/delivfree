import React from "react";
import * as Screens from "app/screens";
import { getStackNavigator } from "./StackNavigator";

const Stack = getStackNavigator();

export const renderAuthStack = () => (
  <>
    <Stack.Screen
      name="Welcome"
      component={Screens.WelcomeScreen}
      options={{
        headerShown: false,
        headerRight: () => null,
      }}
    />
    <Stack.Screen
      name="SignUp"
      component={Screens.SignUpScreen}
      options={{
        headerRight: () => null,
      }}
    />
    <Stack.Screen
      name="Login"
      component={Screens.LoginScreen}
      options={{
        headerRight: () => null,
      }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={Screens.ForgotPasswordScreen}
      options={{
        headerRight: () => null,
      }}
    />
  </>
);
