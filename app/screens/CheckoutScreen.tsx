import { updateUser } from "app/apis/user";
import { Button, Icon, IconTypes, Screen, Text } from "app/components";
import { Card } from "app/components/Card";
import { CartItem } from "app/components/CheckoutCart/CartItem";
import { DeliveryInstructionsModal } from "app/components/CheckoutCart/DeliveryInstructions";
import { EmptyList } from "app/components/EmptyList";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { ModalRef } from "app/components/Modal/CenterModal";
import LocationModal from "app/components/Modal/LocationModal";
import {
  $borderBottom,
  $borderBottomLight,
  $containerPadding,
  $flex,
  $flexRowBetween,
  $row,
  $screen,
  $screenHeading,
  isLargeScreen,
} from "app/components/styles";
import { useLayout } from "app/hooks";
import { useDimensions } from "app/hooks/useDimensions";
import { AppStackScreenProps } from "app/navigators";
import { CheckoutItem } from "app/redux/reducers/checkoutCart";
import { useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import {
  calcCheckoutOrderSubtotal,
  getDeliveryInstructionsTitle,
} from "app/utils/checkout";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import { User } from "delivfree/types";
import React, { useMemo, useRef } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface RestaurantsScreenProps extends AppStackScreenProps<"Checkout"> {}

export const CheckoutScreen = (props: RestaurantsScreenProps) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const deliveryInstructionsModal = useRef<ModalRef>(null);
  const locationModal = useRef<BottomSheetRef>(null);

  const cart = useAppSelector((state) => state.checkoutCart.order);
  const user = useAppSelector((state) => state.user.user as User);

  const handleEnterAddress = () => {
    locationModal.current?.snapToIndex(0);
  };

  const handleChangeDeliveryInstructions = () => {
    deliveryInstructionsModal.current?.open();
  };

  const subtotal = useMemo(
    () => (cart?.items ? calcCheckoutOrderSubtotal(cart.items) : 0),
    [cart?.items]
  );

  const handlePlaceOrder = () => {};

  const RightArrow = useMemo(
    () =>
      ({ style }) =>
        <Icon icon={"arrow-right"} color={"#fff"} style={style} />,
    []
  );

  return (
    <Screen
      style={$screen}
      backgroundColor={colors.surface}
      contentContainerStyle={$containerPadding}
      preset="scroll"
    >
      {!cart?.items.length && (
        <EmptyList icon={"cart"} title={"No items in your cart"} />
      )}
      {!!cart?.items.length && (
        <>
          <Text preset="heading" style={$screenHeading}>
            Checkout
          </Text>

          <View
            style={[{ flexDirection: largeScreen ? "row" : "column", flex: 1 }]}
          >
            <View style={largeScreen ? $flex : undefined}>
              <Card>
                <Text preset="subheading">Delivery details</Text>

                <DetailItem
                  subtitle="Address"
                  title={user?.location?.address || "Enter your address"}
                  icon="map-marker-outline"
                  onPress={handleEnterAddress}
                />

                <DetailItem
                  subtitle="Delivery instructions"
                  title={getDeliveryInstructionsTitle(
                    user?.deliveryInstructions?.type
                  )}
                  icon="account-outline"
                  onPress={handleChangeDeliveryInstructions}
                  style={{ borderBottomWidth: 0 }}
                />
              </Card>
            </View>

            <View style={$spacer} />

            <View style={largeScreen ? $flex : undefined}>
              <CartItemsDropDown items={cart.items} />

              <View style={$spacer} />

              <Card>
                <Text preset="subheading">Order total</Text>
                <View style={{ maxWidth: 500, paddingTop: spacing.sm }}>
                  <View style={$flexRowBetween}>
                    <Text>Subtotal</Text>
                    <Text>{localizeCurrency(subtotal, "CAD")}</Text>
                  </View>
                  <View style={$flexRowBetween}>
                    <Text>Fees</Text>
                    <Text>{localizeCurrency(0, "CAD")}</Text>
                  </View>
                  <View style={$flexRowBetween}>
                    <Text>Tax</Text>
                    <Text>{localizeCurrency(subtotal * 0.12, "CAD")}</Text>
                  </View>
                  <View style={$flexRowBetween}>
                    <Text>Total</Text>
                    <Text>{localizeCurrency(subtotal * 1.12, "CAD")}</Text>
                  </View>
                </View>
              </Card>

              <Button
                preset="reversed"
                text={"Place order"}
                onPress={handlePlaceOrder}
                style={{ marginTop: spacing.md }}
                RightAccessory={RightArrow}
              />
            </View>
          </View>
        </>
      )}

      <DeliveryInstructionsModal
        user={user.id}
        ref={deliveryInstructionsModal}
        deliveryInstructions={user?.deliveryInstructions}
        onClose={() => deliveryInstructionsModal.current?.close()}
      />
      <LocationModal
        ref={locationModal}
        onRequestClose={() => locationModal.current?.close()}
      />
    </Screen>
  );
};

const CartItemsDropDown = ({ items }: { items: CheckoutItem[] }) => {
  const { layout, handleLayout } = useLayout();
  const dropdownHeight = layout?.height || 0;

  const isOpen = useRef(false);
  const openAnimation = useSharedValue(0);

  const open = () => {
    isOpen.current = true;
    openAnimation.value = withTiming(1);
  };

  const close = () => {
    isOpen.current = false;
    openAnimation.value = withTiming(0);
  };

  const animatedStyle = useAnimatedStyle(
    () => ({
      overflow: "hidden",
      height: interpolate(openAnimation.value, [0, 1], [0, dropdownHeight]),
    }),
    [openAnimation, dropdownHeight]
  );

  const arrowStyle = useAnimatedStyle(
    () => ({
      transform: [
        { rotate: `${interpolate(openAnimation.value, [0, 1], [0, 180])}deg` },
      ],
    }),
    [openAnimation]
  );

  return (
    <Card>
      <Pressable
        style={[$row, { justifyContent: "space-between" }]}
        onPress={() => {
          !isOpen.current ? open() : close();
        }}
      >
        <Text preset="subheading">
          Cart summary ({items.length} {pluralFormat("item", items.length)})
        </Text>
        <Animated.View style={arrowStyle}>
          <Icon icon={"chevron-down"} />
        </Animated.View>
      </Pressable>

      <Animated.View style={animatedStyle}>
        <View
          collapsable={false}
          onLayout={handleLayout}
          style={{ paddingTop: spacing.sm }}
        >
          {items.map((item, index, arr) => (
            <CartItem
              item={item}
              key={`checkout-item-${item.id}`}
              style={
                index === arr.length - 1 ? { borderBottomWidth: 0 } : undefined
              }
            />
          ))}
        </View>
      </Animated.View>
    </Card>
  );
};

const DetailItem = ({
  subtitle,
  title,
  icon,
  onPress,
  style,
}: {
  subtitle: string;
  title: string;
  icon: IconTypes;
  onPress?: () => void;
  style?: ViewStyle;
}) => {
  return (
    <Pressable style={[$detailsItem, style]} onPress={onPress}>
      <Icon icon={icon} style={{ marginRight: spacing.md }} size={sizing.xl} />
      <View>
        <Text style={{ color: colors.textDim }} size={"xs"}>
          {subtitle}
        </Text>
        <Text>{title}</Text>
      </View>
    </Pressable>
  );
};

const $detailsItem: StyleProp<ViewStyle> = [
  $borderBottomLight,
  $row,
  { paddingVertical: spacing.md },
];

const $spacer: ViewStyle = {
  height: spacing.md,
  width: spacing.md,
};
