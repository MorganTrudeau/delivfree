import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";
import React from "react";

const Stack = getStackNavigator();

export const renderConsumerRegistrationStack = () => (
  <>
    <Stack.Screen
      name="EditProfile"
      component={Screens.EditUserScreen}
      options={{
        headerRight: () => null,
      }}
    />
  </>
);
