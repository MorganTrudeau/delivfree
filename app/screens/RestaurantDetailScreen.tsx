import { fetchVendorLocationDetail } from "app/apis/vendorLocations";
import { Icon, IconTypes, Screen, Text } from "app/components";
import { AdBanner } from "app/components/AdBanner";
import { CheckoutPopUp, CheckoutPopUpRef } from "app/components/CheckoutPopUp";
import { EmptyList } from "app/components/EmptyList";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RestaurantsScreenProps
  extends AppStackScreenProps<"RestaurantDetail"> {}

export const RestaurantDetailScreen = ({ route }: RestaurantsScreenProps) => {
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
  const gradientStyles: ViewStyle = useMemo(
    () => ({
      height: insets.top,
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
    }),
    [insets.top]
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

  if (!vendorLocation) {
    return (
      <View style={[$flex, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const phoneRestaurant = () => {
    checkoutPopUp.current?.open(`tel:${vendorLocation.phoneNumber}`);
  };
  const viewAddress = () => {
    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${vendorLocation.latitude},${vendorLocation.longitude}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      default: `https://www.google.com/maps/place/${vendorLocation.address}/`,
    });
    Linking.openURL(url);
  };

  return (
    <>
      <Screen style={$flex} preset={"scroll"}>
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
      </Screen>
      {Platform.OS === "ios" && insets.top > 0 && (
        <LinearGradient colors={GRADIENT_COLORS} style={gradientStyles} />
      )}
      <StatusBar style={"light"} />
      <CheckoutPopUp ref={checkoutPopUp} />
    </>
  );
};

interface DetailItemProps {
  icon: IconTypes;
  text: string;
  onPress: () => void;
}
const DetailItem = ({ icon, text, onPress }: DetailItemProps) => {
  return (
    <Pressable style={$detailItem} onPress={onPress}>
      <Icon icon={icon} style={$detailItemIcon} />
      <Text style={$flex}>{text}</Text>
    </Pressable>
  );
};

const GRADIENT_COLORS = ["rgba(0,0,0,0.5)", "rgba(0,0,0,0)"];

const $header: ViewStyle = {
  paddingBottom: Platform.select({ default: 0, web: spacing.md }),
};
const $headerImage: ImageStyle = Platform.select({
  default: { width: "100%", aspectRatio: 2.8 },
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
