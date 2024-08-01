import React, { FC, useEffect, useMemo, useState } from "react";
import { FlatList, Platform, Pressable, View, ViewStyle } from "react-native";
import { ListItem } from "./ListItem";
import { colors, spacing } from "app/theme";
import { rateApp } from "app/utils/rate";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "app/hooks";
import FastImage from "react-native-fast-image";
import { AppStackParamList } from "app/navigators/StackNavigator";
import { useAppSelector } from "app/redux/store";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { Icon } from "./Icon";

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
  { text: "Orders", route: "Orders" },
  { text: "Tips", route: "Tips" },
  { text: "Menus", route: "Menus", include: () => Platform.OS === "web" },
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
  { text: "Tips", route: "Tips" },
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
  alwaysOpen,
  closeDrawer,
}: {
  navigation: NavigationContainerRefWithCurrent<AppStackParamList>;
  onItemPress: () => void;
  alwaysOpen: boolean;
  closeDrawer: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const userType = useAppSelector((state) => state.appConfig.userType);
  const Items = useMemo(() => {
    const items =
      userType === "vendor"
        ? VendorItems
        : userType === "driver"
        ? DriverItems
        : userType === "admin"
        ? AdminItems
        : ConsumerItems;
    return items.filter(
      (item) => !item.include || item.include()
    ) as DrawerItem[];
  }, [userType]);

  console.log({ userType, Items });

  const [activeRoute, setActiveRoute] = useState(
    navigation.getCurrentRoute()?.name
  );

  const navigationReady = navigation.isReady();
  useEffect(() => {
    if (navigationReady) {
      setActiveRoute(navigation.getCurrentRoute()?.name);
    }
  }, [navigationReady]);

  navigation.addListener("state", (event) => {
    setActiveRoute(getRouteNameFromNavState(event.data?.state));
  });

  const renderListHeader = useMemo(
    () => () =>
      (
        <View>
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
          {!alwaysOpen && (
            <Pressable
              hitSlop={20}
              style={{
                position: "absolute",
                top: spacing.sm,
                right: 0,
              }}
              onPress={closeDrawer}
            >
              <Icon icon="close" />
            </Pressable>
          )}
        </View>
      ),
    [headerHeight]
  );

  return (
    <FlatList<{ text: string; route?: keyof AppStackParamList; params?: any }>
      key={userType}
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
  backgroundColor: colors.background,
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

const getRouteNameFromNavState = (state) => {
  const index = state?.index;
  if (!state || typeof index !== "number") {
    return "";
  }
  return state.routes[index].name;
};
