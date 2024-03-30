import * as Screens from "app/screens";
import { getStackNavigator } from "../StackNavigator";
import { Pressable } from "react-native";
import { spacing } from "app/theme";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "app/components";

const Stack = getStackNavigator();

export const renderConsumerMainStack = () => {
  const navigation = useNavigation();
  return (
    <>
      <Stack.Screen name="Home" component={Screens.HomeScreen} />
      <Stack.Screen
        name="Restaurants"
        component={Screens.RestaurantsScreen}
        options={{
          headerShown: true,
          headerTransparent: false,
        }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={Screens.RestaurantDetailScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          headerLeft: (props) =>
            props.canGoBack ? (
              <Pressable
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 100,
                  padding: spacing.xxs,
                }}
                onPress={() => navigation.goBack()}
              >
                <Icon icon={"arrow-left"} color={"#fff"} />
              </Pressable>
            ) : null,
        }}
      />
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
  );
};
