import React, { FC, useMemo } from "react";
import { FlatList, Platform, View, ViewStyle } from "react-native";
import { ListItem } from "./ListItem";
import { colors, spacing } from "app/theme";
import { NavigationProp } from "app/navigators";
import { rateApp } from "app/utils/rate";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "app/hooks";
import FastImage from "react-native-fast-image";
import { AppStackParamList } from "app/navigators/StackNavigator";
import { useAppSelector } from "app/redux/store";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";

type DrawerItem = {
  text: string;
  route?: keyof AppStackParamList;
  params?: any;
  include?: () => boolean;
};

const ConsumerItems: DrawerItem[] = [
  { text: "Home", route: "Home" },
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

const VendorItems: DrawerItem[] = [
  { text: "Home", route: "Home" },
  { text: "Menus", route: "Menus" },
  { text: "Orders", route: "Orders" },
  { text: "Locations", route: "Locations" },
  { text: "Positions", route: "Positions" },
  { text: "Subscription", route: "Subscription" },
  { text: "Profile", route: "Profile" },
  {
    text: "Rate App",
    include: () => Platform.OS !== "web",
  },
  { text: "Settings", route: "Settings" },
];

const DriverItems: DrawerItem[] = [
  { text: "Orders", route: "Orders" },
  { text: "Subscription", route: "Subscription" },
  { text: "Profile", route: "Profile" },
  {
    text: "Rate App",
    include: () => Platform.OS !== "web",
  },
  { text: "Settings", route: "Settings" },
];

const AdminItems: DrawerItem[] = [
  { text: "Vendors", route: "Vendors" },
  { text: "Drivers", route: "Drivers" },
  { text: "Users", route: "Users" },
  { text: "Ad Config", route: "AdConfig" },
  { text: "Settings", route: "Settings" },
];

export const DrawerContent = ({
  navigation,
  onItemPress,
}: {
  navigation: NavigationContainerRefWithCurrent<AppStackParamList>;
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
        : userType === "admin"
        ? AdminItems
        : ConsumerItems,
    [userType]
  );

  const activeRoute = useMemo(() => {
    const state = navigation.current?.getState();
    return state?.routes[state.index].name;
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
  navigation: NavigationContainerRefWithCurrent<AppStackParamList>;
  onItemPress: () => void;
  activeRoute: string | undefined;
}

const DrawerItem: FC<DemoListItem> = ({
  item,
  index,
  navigation,
  onItemPress,
  activeRoute,
}) => {
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
        onItemPress();
        if (isRateItem) {
          rateApp(false);
        } else if (item.route) {
          // @ts-ignore
          navigation.current?.navigate(item.route, item.params);
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
