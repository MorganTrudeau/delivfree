import { createPendingOrder } from "app/apis/orders";
import { createStripeCheckoutSession } from "app/apis/stripe";
import { Button, Icon, IconTypes, Screen, Text } from "app/components";
import { Card } from "app/components/Card";
import { CartItem } from "app/components/CheckoutCart/CartItem";
import { CartItemsModal } from "app/components/CheckoutCart/CartItemsModal";
import { CheckoutTotals } from "app/components/CheckoutCart/CheckoutTotals";
import { DeliveryInstructionsModal } from "app/components/CheckoutCart/DeliveryInstructions";
import { EmptyList } from "app/components/EmptyList";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { ModalRef } from "app/components/Modal/CenterModal";
import LocationModal from "app/components/Modal/LocationModal";
import { UserPhoneNumberModal } from "app/components/Users/UserPhoneNumberModal";
import {
  $borderBottomLight,
  $containerPadding,
  $flex,
  $row,
  $screen,
  $screenHeading,
  $spacerBorder,
  MAX_CONTAINER_WIDTH,
  isLargeScreen,
} from "app/components/styles";
import { useAlert, useLayout } from "app/hooks";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useDimensions } from "app/hooks/useDimensions";
import { AppStackScreenProps } from "app/navigators";
import { CheckoutItem } from "app/redux/reducers/checkoutCart";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { fetchVendor } from "app/redux/thunks/vendor";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import {
  calcCheckoutOrderSubtotal,
  checkoutItemsStripeLineItems,
  getDeliveryInstructionsTitle,
} from "app/utils/checkout";
import { pluralFormat } from "app/utils/general";
import { Order, TipType, User } from "delivfree/types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Stripe from "stripe";

interface RestaurantsScreenProps extends AppStackScreenProps<"Checkout"> {}

export const CheckoutScreen = (props: RestaurantsScreenProps) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const Alert = useAlert();
  const insets = useSafeAreaInsets();

  const deliveryInstructionsModal = useRef<ModalRef>(null);
  const phoneNumberModal = useRef<ModalRef>(null);
  const locationModal = useRef<BottomSheetRef>(null);

  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.checkoutCart.order);
  const user = useAppSelector((state) => state.user.user as User);

  const vendorLocationId = cart?.vendorLocation;
  const vendorId = cart?.vendor;

  const vendor = useAppSelector((state) =>
    vendorId ? state.vendor.data[vendorId] : null
  );

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendor(vendorId));
    }
  }, [vendorLocationId, vendorId]);

  const handleEnterAddress = () => {
    locationModal.current?.snapToIndex(0);
  };

  const handleEnterPhoneNumber = () => {
    phoneNumberModal.current?.open();
  };
  const closePhoneNumberModal = () => {
    phoneNumberModal.current?.close();
  };

  const handleChangeDeliveryInstructions = () => {
    deliveryInstructionsModal.current?.open();
  };

  const [tipState, setTipState] = useState<{
    type: TipType;
    amount: string;
  }>({ type: "18", amount: "" });

  const subtotal = useMemo(
    () => (cart?.items ? calcCheckoutOrderSubtotal(cart.items) : 0),
    [cart?.items]
  );
  const tip = useMemo(() => {
    if (tipState.type === "other") {
      return Number(tipState.amount);
    } else {
      return subtotal * (Number(tipState.type) / 100);
    }
  }, [subtotal, tipState]);
  const taxRate = vendor?.stripe.taxRates[0];
  const tax = Number(
    (
      (taxRate && taxRate.percentage ? Number(taxRate.percentage) / 100 : 0) *
      subtotal
    ).toFixed(2)
  );
  const total = Number((subtotal + tax).toFixed(2)) + tip;

  const handlePlaceOrder = useCallback(async () => {
    if (!user.phoneNumber) {
      return Alert.alert(
        "Phone number",
        "Please enter your phone number in case you need to be contacted about your order."
      );
    }
    if (!(cart && vendor && vendor.stripe.accountId)) {
      throw `missing-data`;
    }

    const lineItems: Stripe.Checkout.SessionCreateParams["line_items"] =
      checkoutItemsStripeLineItems(
        cart.items,
        tip,
        vendor.stripe.currency,
        vendor.stripe.taxRates[0]?.id
      );
    const session = await createStripeCheckoutSession({
      line_items: lineItems,
      payment_intent_data: {
        application_fee_amount: 0,
        transfer_data: {
          destination: vendor.stripe.accountId,
        },
      },
      mode: "payment",
      ui_mode: "embedded",
      customer_email: user?.email || undefined,
      redirect_on_completion: "never",
    });

    const order: Order = {
      id: cart.id,
      customer: cart.customer,
      subtotal: ((session.amount_subtotal || 0) / 100).toFixed(2),
      tip: tip.toFixed(2),
      tax: ((session.total_details?.amount_tax || 0) / 100).toFixed(2),
      total: ((session.amount_total || 0) / 100).toFixed(2),
      status: "pending",
      date: Date.now(),
      vendor: cart.vendor,
      vendorLocation: cart.vendorLocation,
      checkoutItems: cart.items,
      driver: null,
      deliveryInstructions: user.deliveryInstructions,
      currency: session.currency || vendor.stripe.currency,
    };

    if (session && session.client_secret) {
      await createPendingOrder(session.id, order);
      props.navigation.navigate("Payment", {
        clientSecret: session.client_secret,
      });
    }
  }, [cart, vendor, tip]);

  const { exec: placeOrder, loading: placeOrderLoading } =
    useAsyncFunction(handlePlaceOrder);

  const ButtonIcon = useMemo(
    () =>
      placeOrderLoading
        ? ({ style }) => <ActivityIndicator color={"#fff"} style={style} />
        : ({ style }) => (
            <Icon icon={"arrow-right"} color={"#fff"} style={style} />
          ),
    [placeOrderLoading]
  );

  return (
    <Screen
      style={$screen}
      backgroundColor={
        width > MAX_CONTAINER_WIDTH ? colors.surface : colors.background
      }
      contentContainerStyle={[
        $containerPadding,
        { paddingBottom: spacing.md + insets.bottom },
      ]}
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
            style={{ flexDirection: largeScreen ? "row" : "column", flex: 1 }}
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
                  subtitle="Phone number"
                  title={user?.phoneNumber || "Enter your phone number"}
                  icon="phone-outline"
                  onPress={handleEnterPhoneNumber}
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

            <View
              style={width > MAX_CONTAINER_WIDTH ? $spacer : $spacerBorder}
            />

            <View style={largeScreen ? $flex : undefined}>
              {Platform.OS === "web" ? (
                <CartItemsDropDown items={cart.items} />
              ) : (
                <CartItemsModal items={cart.items} />
              )}

              <View
                style={width > MAX_CONTAINER_WIDTH ? $spacer : $spacerBorder}
              />

              <Card>
                <Text preset="subheading">Order price</Text>
                <CheckoutTotals
                  currency={vendor?.stripe.currency}
                  total={total}
                  subtotal={subtotal}
                  tax={tax}
                  tip={tip}
                  onTipChange={(type, amount) =>
                    setTipState({ type, amount: amount || "" })
                  }
                  tipAmount={tipState.amount}
                  tipType={tipState.type}
                  style={{ maxWidth: 500, paddingTop: spacing.sm }}
                />
              </Card>

              <Button
                preset="reversed"
                text={"Place order"}
                onPress={placeOrder}
                style={{ marginTop: spacing.md }}
                RightAccessory={ButtonIcon}
              />
            </View>
          </View>
        </>
      )}

      <UserPhoneNumberModal
        ref={phoneNumberModal}
        onClose={closePhoneNumberModal}
      />
      <DeliveryInstructionsModal
        user={user.id}
        ref={deliveryInstructionsModal}
        deliveryInstructions={user?.deliveryInstructions}
        onClose={() => deliveryInstructionsModal.current?.close()}
      />
      <LocationModal
        ref={locationModal}
        onRequestClose={() => locationModal.current?.close()}
        title={"Delivery address"}
      />
    </Screen>
  );
};

const CartItemsDropDown = ({
  items,
  startOpen,
}: {
  items: CheckoutItem[];
  startOpen?: boolean;
}) => {
  const { layout, handleLayout } = useLayout();
  const dropdownHeight = layout?.height || 0;

  const isOpen = useRef(!!startOpen);
  const openAnimation = useSharedValue(startOpen ? 1 : 0);

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
