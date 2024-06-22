import { useScrollEventsHandlersDefault } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { fetchVendorLocationDetail } from "app/apis/vendorLocations";
import { Icon, IconTypes, Screen, Text } from "app/components";
import { AdBanner } from "app/components/AdBanner";
import { CheckoutCartTracker } from "app/components/CheckoutCart/CheckoutCartTracker";
import { CheckoutPopUp, CheckoutPopUpRef } from "app/components/CheckoutPopUp";
import { EmptyList } from "app/components/EmptyList";
import { LogoHeader } from "app/components/LogoHeader";
import { ConsumerMenuCategories } from "app/components/Menus/ConsumerMenu/ConsumerMenuCategories";
import { MenuNames } from "app/components/Menus/Menu/MenuNames";
import { $flex, MAX_CONTENT_WIDTH } from "app/components/styles";
import { getRestaurantCache } from "app/hooks";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import { AppStackScreenProps } from "app/navigators";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { isMenuActive } from "app/utils/menus";
import { Menu, VendorLocation } from "delivfree/types";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RestaurantsScreenProps
  extends AppStackScreenProps<"RestaurantDetail"> {}

export const RestaurantDetailScreen = ({
  route,
  navigation,
}: RestaurantsScreenProps) => {
  const { restaurantId } = route.params;

  const [vendorLocation, setVendorLocation] = useState<
    VendorLocation | undefined
  >(getRestaurantCache().cache[restaurantId]);

  useEffect(() => {
    if (!vendorLocation) {
      const load = async () => {
        const data = await fetchVendorLocationDetail(restaurantId);

        if (data) {
          setVendorLocation(data);
        }
      };
      load();
    }
  }, [vendorLocation]);

  const checkoutPopUp = useRef<CheckoutPopUpRef>(null);

  const insets = useSafeAreaInsets();
  const headerHeight = 50 + insets.top;

  const gradientStyles: ViewStyle = useMemo(
    () => ({
      paddingTop: insets.top,
      height: headerHeight,
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
    }),
    [insets.top, headerHeight]
  );

  const vendor = vendorLocation?.vendor;

  const { menus, menusLoaded, loadMenus } = useMenusLoading({
    vendor,
  });

  const filteredMenus = useMemo(() => menus.filter(isMenuActive), [menus]);

  const firstMenuId = filteredMenus[0]?.id;

  const [activeMenu, setActiveMenu] = useState<string>();

  useEffect(() => {
    if (vendor) {
      loadMenus(false);
    }
  }, [vendor]);
  useEffect(() => {
    if (firstMenuId && !activeMenu) {
      setActiveMenu(firstMenuId);
    }
  }, [firstMenuId, activeMenu]);

  const handleMenuPress = (menu: Menu) => {
    setActiveMenu(menu.id);
  };

  const renderHeader = () => {
    if (!vendorLocation) {
      return null;
    }
    return (
      <View style={$header}>
        <View style={$headerImage}>
          <FastImage
            source={{ uri: vendorLocation.image }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        <Text
          preset={"subheading"}
          style={$name}
          size={Platform.select({ web: "xxl", default: "xl" })}
        >
          {vendorLocation.name}
        </Text>
        <AdBanner type="checkout" style={$adBanner} />
      </View>
    );
  };

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => (scrollY.value = event.contentOffset.y),
  });

  const headerStyle: ViewStyle = useMemo(
    () => ({
      paddingTop: insets.top,
      height: headerHeight,
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      paddingLeft: spacing.sm,
      paddingRight: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }),
    [headerHeight, insets.top]
  );
  const animatedHeaderStyle = useAnimatedStyle(
    () => ({
      justifyContent: "center",
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      opacity: interpolate(scrollY.value, [0, headerHeight], [0, 1]),
    }),
    [scrollY, headerHeight]
  );
  const scrollShowStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(scrollY.value, [0, headerHeight], [0, 1]),
    }),
    [scrollY, headerHeight]
  );
  const scrollShowTransitionStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(
        interpolate(
          scrollY.value,
          [0, headerHeight - 1, headerHeight, headerHeight + 1],
          [0, 0, 1, 1]
        )
      ),
    }),
    [scrollY, headerHeight]
  );
  const scrollHideStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(scrollY.value, [0, headerHeight], [1, 0]),
    }),
    [scrollY, headerHeight]
  );

  if (!vendorLocation) {
    return (
      <View style={[$flex, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Animated.ScrollView style={$flex} onScroll={onScroll}>
        {Platform.OS !== "web" && renderHeader()}
        <View style={$detailsContainer}>
          {Platform.OS === "web" && renderHeader()}
          <View style={{ height: spacing.sm }} />
          {!menusLoaded && <ActivityIndicator color={colors.primary} />}
          {!vendorLocation.isOpen && (
            <View style={{ paddingBottom: spacing.md }}>
              <Text preset="subheading">Restaurant closed</Text>
              {!!vendorLocation.nextOpen && (
                <Text style={{ color: colors.primary }}>
                  Opens {vendorLocation.nextOpen}
                </Text>
              )}
            </View>
          )}

          {menusLoaded && !filteredMenus.length && (
            <EmptyList
              title={"No menus available right now"}
              icon={"silverware"}
            />
          )}
          <MenuNames
            menus={filteredMenus}
            onMenuPress={handleMenuPress}
            activeMenu={activeMenu}
          />
          {!!activeMenu && vendorLocation && (
            <ConsumerMenuCategories
              menu={activeMenu}
              vendor={vendorLocation.vendor}
              vendorLocation={vendorLocation.id}
              vendorLocationClosed={!vendorLocation.isOpen}
            />
          )}
        </View>
      </Animated.ScrollView>
      {Platform.OS !== "web" && (
        <>
          <Animated.View style={[headerStyle, animatedHeaderStyle]}>
            <Animated.View style={scrollShowTransitionStyle}>
              <LogoHeader />
            </Animated.View>
          </Animated.View>
          <Animated.View style={[gradientStyles, scrollHideStyle]}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              style={StyleSheet.absoluteFill}
            ></LinearGradient>
          </Animated.View>
          <View style={headerStyle}>
            <Pressable
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 100,
                padding: spacing.xxs,
              }}
              onPress={() => {
                console.log("BACK");
                navigation.goBack();
              }}
            >
              <Icon icon={"arrow-left"} color={"#fff"} />
            </Pressable>
            <View>
              <Animated.View style={scrollHideStyle}>
                <CheckoutCartTracker color={colors.white} />
              </Animated.View>
              <Animated.View
                style={[{ position: "absolute" }, scrollShowStyle]}
              >
                <CheckoutCartTracker />
              </Animated.View>
            </View>
          </View>
        </>
      )}
      <StatusBar style={"light"} />
      <CheckoutPopUp ref={checkoutPopUp} />
    </>
  );
};

const GRADIENT_COLORS = ["rgba(25,16,21,0.5)", "rgba(25,16,21,0)"];

const $header: ViewStyle = {
  paddingBottom: Platform.select({ default: 0, web: spacing.md }),
};
const $headerImage: ImageStyle = Platform.select({
  default: { width: "100%", aspectRatio: 2.5 },
  web: {
    aspectRatio: 4,
    borderRadius: borderRadius.md,
    width: "100%",
    overflow: "hidden",
  },
});
const $name: TextStyle = {
  textAlign: Platform.select({ default: "center", web: "left" }),
  marginTop: spacing.sm,
};
const $detailsContainer: ViewStyle = {
  padding: spacing.md,
  maxWidth: MAX_CONTENT_WIDTH,
  width: "100%",
  alignSelf: "center",
};
const $detailItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.sm,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.border,
};
const $detailItemIcon: ViewStyle = { marginRight: spacing.sm };
const $adBanner: ViewStyle = {
  paddingHorizontal: Platform.select({ default: spacing.md, web: 0 }),
  marginTop: spacing.md,
};
