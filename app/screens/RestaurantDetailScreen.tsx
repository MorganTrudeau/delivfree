import { Icon, IconTypes, Screen, Text } from "app/components";
import { AdBanner } from "app/components/AdBanner";
import { CheckoutPopUp, CheckoutPopUpRef } from "app/components/CheckoutPopUp";
import { $flex, $screen, $shadow } from "app/components/styles";
import { getRestaurantCache } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useRef } from "react";
import {
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
  const restaurant = useRef(getRestaurantCache().cache[restaurantId]).current;
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
  const viewMenu = () => {
    checkoutPopUp.current?.open(restaurant.menuLink);
    // Linking.openURL(restaurant.menuLink);
  };
  const orderOnline = () => {
    checkoutPopUp.current?.open(restaurant.orderLink);
    // Linking.openURL(restaurant.orderLink);
  };
  const phoneRestaurant = () => {
    checkoutPopUp.current?.open(`tel:${restaurant.phoneNumber}`);
    // Linking.openURL(`tel:${restaurant.phoneNumber}`);
  };
  const viewAddress = () => {
    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${restaurant.latitude},${restaurant.longitude}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      default: `https://www.google.com/maps/place/${restaurant.address}/`,
    });
    Linking.openURL(url);
  };
  return (
    <>
      <Screen style={$screen} preset={"scroll"}>
        <View style={$headerImage}>
          <FastImage
            source={{ uri: restaurant.image }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        <Text preset={"subheading"} style={$name} size={"xl"}>
          {restaurant.name}
        </Text>
        <AdBanner type="checkout" style={$adBanner} />
        {/* <View style={$freeDeliveryNotice}>
          <Text size={"sm"} weight="semiBold">
            FREE DELIVERY & ZERO ADDED FEES
          </Text>
          <Text size={"xs"}>
            You are saving money on this order via DelivFree. The menu price is
            all you pay!
          </Text>
        </View> */}
        <View style={$detailsContainer}>
          {!!restaurant.menuLink && (
            <DetailItem
              text={"View menu"}
              icon={"food-fork-drink"}
              onPress={viewMenu}
            />
          )}
          {!!restaurant.orderLink && (
            <DetailItem
              text={"Order online"}
              icon={"web"}
              onPress={orderOnline}
            />
          )}
          {!!restaurant.phoneNumber && (
            <DetailItem
              text={"Order by phone"}
              icon={"phone"}
              onPress={phoneRestaurant}
            />
          )}
          {!!restaurant.address && (
            <DetailItem
              text={restaurant.address}
              icon={"pin"}
              onPress={viewAddress}
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

const $headerImage: ImageStyle = { width: "100%", aspectRatio: 2.8 };
const $name: TextStyle = { textAlign: "center", marginTop: spacing.sm };
const $detailsContainer: ViewStyle = { padding: spacing.md };
const $detailItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.sm,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.border,
};
const $detailItemIcon: ViewStyle = { marginRight: spacing.sm };
const $freeDeliveryNotice: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  marginHorizontal: spacing.md,
  marginTop: spacing.md,
  backgroundColor: colors.palette.neutral200,
  borderRadius: borderRadius.md,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border,
};

const $adBanner: ViewStyle = {
  paddingHorizontal: spacing.md,
  marginTop: spacing.md,
};
