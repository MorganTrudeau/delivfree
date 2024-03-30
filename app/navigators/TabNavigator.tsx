import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../components";
import { translate } from "../i18n";
import { HomeScreen } from "../screens";
import { colors, spacing, typography } from "../theme";
import { AppStackScreenProps } from "./AppNavigator";
import { sizing } from "app/theme/sizing";
import { LG_SCREEN } from "app/components/styles";
import { AppStackParamList } from "./StackNavigator";

export type TabParamList = {
  Home: undefined;
  Leaderboard: undefined;
  Profile: undefined;
  Vetting: undefined;
};

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>;

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          $tabBar,
          {
            height: bottom + TAB_ICON_SIZE + spacing.xs * 2 + 20,
            paddingTop: spacing.xs,
            paddingBottom: bottom + spacing.xs,
          },
        ],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: translate("common.home"),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="home"
              color={focused ? colors.tint : undefined}
              size={TAB_ICON_SIZE}
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Vetting"
        component={RateQuestionsScreen}
        options={{
          tabBarAccessibilityLabel: "Vetting",
          tabBarLabel: "Vetting",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="message-star"
              color={focused ? colors.tint : undefined}
              size={TAB_ICON_SIZE}
            />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

const TAB_ICON_SIZE = sizing.lg;

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
};

const $tabBarItem: ViewStyle = {
  // paddingTop: spacing.xs,
  // paddingBottom: spacing.xs,
};

const $tabBarLabel: TextStyle = {
  fontSize: LG_SCREEN ? 16 : 12,
  fontFamily: typography.primary.medium,
  lineHeight: LG_SCREEN ? 20 : 16,
  flexShrink: 1,
  // marginBottom: spacing.xs
};

// @demo remove-file
