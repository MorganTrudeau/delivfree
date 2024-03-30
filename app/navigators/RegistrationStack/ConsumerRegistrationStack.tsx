import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";

const Stack = getStackNavigator();

export const renderConsumerRegistrationStack = () => (
  <>
    <Stack.Screen
      name="EditProfile"
      component={Screens.EditUserScreen}
      options={{
        headerShown: true,
        headerRight: () => null,
        headerTransparent: false,
      }}
    />
  </>
);
