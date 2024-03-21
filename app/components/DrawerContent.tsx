import React, { FC } from "react";
import { FlatList, TextStyle, View, ViewStyle } from "react-native";
import { ListItem } from "./ListItem";
import { isRTL } from "app/i18n";
import { colors, spacing } from "app/theme";
import { Text } from "./Text";
import { AppStackParamList, NavigationProp } from "app/navigators";
import { GameTypes } from "smarticus/enums";
import { rateApp } from "app/utils/rate";
import { Icon } from "./Icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "app/hooks";

const Items = [
  {
    text: "Ranked Game",
    route: "Category",
    params: { gameType: GameTypes.RANKED },
  },
  {
    text: "Training Game",
    route: "Category",
    params: { gameType: GameTypes.CASUAL },
  },
  { text: "Versus", route: "Versus", params: {} },
  {
    text: "Rate App",
  },
  { text: "Blocked Users", route: "BlockedUsers" },
  { text: "Settings", route: "Settings" },
] as const;

export const DrawerContent = ({
  navigation,
  onItemPress,
}: {
  navigation: NavigationProp;
  onItemPress: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  return (
    <FlatList<{ text: string; route?: keyof AppStackParamList; params?: any }>
      style={$drawer}
      contentContainerStyle={[
        $flatListContentContainer,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left + spacing.md,
          paddingRight: spacing.md,
        },
      ]}
      data={Items}
      keyExtractor={(item) => item.text}
      renderItem={({ item, index }) => (
        <DrawerItem {...{ item, index, navigation, onItemPress }} />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={[$logoContainer, { height: headerHeight }]}>
          <Text preset="heading" size={"xl"}>
            SMARTICUS
          </Text>
        </View>
      }
    />
  );
};

interface DemoListItem {
  item: {
    text: string;
    route?: keyof AppStackParamList;
    params?: any;
    RightComponent?: React.ReactElement;
  };
  index: number;
  navigation: NavigationProp;
  onItemPress: () => void;
}

const DrawerItem: FC<DemoListItem> = ({
  item,
  index,
  navigation,
  onItemPress,
}) => {
  const icon = isRTL ? "caretLeft" : "caretRight";
  const isRateItem = item.text === "Rate App";

  return (
    <ListItem
      key={`section${index}-${item.text}`}
      text={item.text}
      RightComponent={
        item.RightComponent ? (
          <View style={$rightComponent}>
            {item.RightComponent}
            <Icon icon={icon} style={$icon} size={24} />
          </View>
        ) : undefined
      }
      rightIcon={icon}
      onPress={() => {
        if (isRateItem) {
          rateApp(false);
        } else if (item.route) {
          onItemPress();
          return navigation.navigate(item.route, item.params);
        }
      }}
    />
  );
};

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  // paddingHorizontal: spacing.md,
  // paddingVertical: spacing.md,
  flexGrow: 1,
};

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  // paddingTop: spacing.xs,
  marginBottom: spacing.sm,
};

const $rightComponent: ViewStyle = {
  height: 56,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
};

const $icon: TextStyle = {
  marginStart: spacing.xs,
};
