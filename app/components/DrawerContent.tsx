import React, { FC, useMemo } from "react";
import { FlatList, Platform, View, ViewStyle } from "react-native";
import { ListItem } from "./ListItem";
import { isRTL } from "app/i18n";
import { colors, spacing } from "app/theme";
import { NavigationProp } from "app/navigators";
import { rateApp } from "app/utils/rate";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "app/hooks";
import FastImage from "react-native-fast-image";
import { AppStackParamList } from "app/navigators/StackNavigator";
import { useAppSelector } from "app/redux/store";

type DrawerItem = {
  text: string;
  route?: keyof AppStackParamList;
  params?: any;
  include?: () => boolean;
};

const ConsumerItems: DrawerItem[] = [
  {
    text: "Sign up as a Vendor",
  },
  {
    text: "Sign up as a Driver",
  },
  {
    text: "Rate App",
    include: () => Platform.OS !== "web",
  },
  { text: "Settings", route: "Settings" },
];

const VendorItems = [
  { text: "Home", route: "Home" },
  { text: "Orders", route: "Orders" },
  { text: "Locations", route: "Locations" },
  { text: "Drivers", route: "Drivers" },
  { text: "Subscription", route: "Subscription" },
  { text: "Profile", route: "Profile" },
  {
    text: "Rate App",
    include: () => Platform.OS !== "web",
  },
  { text: "Settings", route: "Settings" },
];

const DriverItems = [];

export const DrawerContent = ({
  navigation,
  onItemPress,
}: {
  navigation: NavigationProp;
  onItemPress: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const userType = useAppSelector((state) => state.appConfig.userType);
  const Items = useMemo(
    () =>
      userType === "vendor"
        ? VendorItems
        : userType === "driver"
        ? DriverItems
        : ConsumerItems,
    [userType]
  );

  const activeRoute = useMemo(() => {
    const state = navigation.getState();
    return state.routes[state.index].name;
  }, [navigation]);

  const renderListHeader = useMemo(
    () => () =>
      (
        <View style={$logoContainer}>
          <FastImage
            source={require("../../assets/images/delivfree-logo.png")}
            style={{
              height: headerHeight,
              width: headerHeight * headerImageRatio,
            }}
            resizeMode="contain"
          />
        </View>
      ),
    [headerHeight]
  );

  const items = useMemo(
    () =>
      Items.filter((item) => !item.include || item.include()) as DrawerItem[],
    []
  );

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
      data={items}
      keyExtractor={(item) => item.text}
      renderItem={({ item, index }) => (
        <DrawerItem
          {...{ item, index, navigation, onItemPress, activeRoute }}
        />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderListHeader}
    />
  );
};

const headerImageRatio = 1638 / 822;
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
  activeRoute: string;
}

const DrawerItem: FC<DemoListItem> = ({
  item,
  index,
  navigation,
  onItemPress,
  activeRoute,
}) => {
  const icon = isRTL ? "caretLeft" : "caretRight";
  const isRateItem = item.text === "Rate App";

  return (
    <ListItem
      key={`section${index}-${item.text}`}
      text={item.text}
      textStyle={
        "route" in item && item.route === activeRoute
          ? { color: colors.primary }
          : undefined
      }
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
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  flexGrow: 1,
};

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  paddingTop: spacing.md,
  paddingBottom: spacing.md,
};
