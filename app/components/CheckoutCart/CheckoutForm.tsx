import { createPendingOrder } from "app/apis/orders";
import { Button, Icon, IconTypes, Text } from "app/components";
import { Card } from "app/components/Card";
import { CartItem } from "app/components/CheckoutCart/CartItem";
import { CartItemsModal } from "app/components/CheckoutCart/CartItemsModal";
import { CheckoutTotals } from "app/components/CheckoutCart/CheckoutTotals";
import { DeliveryInstructionsModal } from "app/components/CheckoutCart/DeliveryInstructions";
import { EmptyList } from "app/components/EmptyList";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { ModalRef } from "app/utils/types";
import LocationModal from "app/components/Modal/LocationModal";
import { UserPhoneNumberModal } from "app/components/Users/UserPhoneNumberModal";
import {
  $borderBottomLight,
  $borderedArea,
  $flex,
  $flexShrink,
  $row,
  $screenHeading,
  $spacerBorder,
  MAX_CONTAINER_WIDTH,
  isLargeScreen,
} from "app/components/styles";
import { withStripe } from "app/hocs/withStripe";
import { useAlert, useCheckout, useLayout } from "app/hooks";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useDimensions } from "app/hooks/useDimensions";
import { emptyCart } from "app/redux/reducers/checkoutCart";
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
import { CheckoutItem, Order, TipType, User } from "delivfree";
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
import Stripe from "stripe";
import { PaymentSuccess } from "../PaymentSuccess";
import { navigationRef } from "app/navigators";

export const CheckoutForm = withStripe(function CheckoutForm({
  onPaymentSuccess,
}: {
  onPaymentSuccess: () => void;
}) {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const Alert = useAlert();

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

  const lineItems: Stripe.Checkout.SessionCreateParams["line_items"] =
    useMemo(() => {
      if (!(cart && vendor)) {
        return [];
      }
      return checkoutItemsStripeLineItems(
        cart.items,
        tip,
        vendor.stripe.currency,
        vendor.stripe.taxRates[0]?.id
      );
    }, [cart, vendor]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    dispatch(emptyCart());
    onPaymentSuccess();
  };

  const { onCheckout } = useCheckout({
    onPaymentSuccess: handlePaymentSuccess,
  });

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

    const order: Order = {
      id: cart.id,
      customer: cart.customer,
      subtotal: subtotal.toFixed(2),
      tip: tip.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      status: "pending",
      date: Date.now(),
      vendor: cart.vendor,
      vendorLocation: cart.vendorLocation,
      checkoutItems: cart.items,
      driver: null,
      deliveryInstructions: user.deliveryInstructions || {
        type: "meet-door",
        note: "",
      },
      currency: vendor.stripe.currency,
    };

    await createPendingOrder(order);
    await onCheckout({
      email: user.email,
      stripeAccount: vendor.stripe.accountId,
      currency: vendor?.stripe.currency || "cad",
      amount: total,
      lineItems,
      metadata: { orderId: cart?.id || "" },
    });
  }, [cart, vendor, tip, user, onCheckout]);

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

  if (paymentSuccess) {
    return (
      <PaymentSuccess
        title={"Order placed"}
        message={"Your order will be delivered soon"}
        onButtonPress={() => navigationRef.current?.navigate("Home")}
        buttonTitle="Go home"
      />
    );
  }

  return (
    <>
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
                  RightComponent={
                    !user.phoneNumber && (
                      <Icon icon="information-outline" color={colors.error} />
                    )
                  }
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
                  style={{
                    maxWidth: 500,
                    paddingTop: spacing.sm,
                    marginBottom: spacing.xs,
                  }}
                />
                <View style={[$borderedArea, { flexDirection: "row" }]}>
                  <Icon
                    icon={"star"}
                    color={colors.primary}
                    style={{ marginRight: spacing.sm }}
                  />
                  <Text size={"xs"} style={$flexShrink}>
                    You are saving money on this order via{" "}
                    <Text preset="semibold" size={"xs"}>
                      DelivFree
                    </Text>{" "}
                    with{" "}
                    <Text preset="semibold" size={"xs"}>
                      (FREE DELIVERY & ZERO ADDED FEES)
                    </Text>{" "}
                    The menu price is all you pay!
                  </Text>
                </View>
              </Card>

              <Button
                preset="reversed"
                text={"Place order"}
                onPress={placeOrder}
                style={{ marginTop: spacing.md }}
                RightAccessory={ButtonIcon}
                disabled={placeOrderLoading}
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
    </>
  );
});

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
  RightComponent,
}: {
  subtitle: string;
  title: string;
  icon: IconTypes;
  onPress?: () => void;
  style?: ViewStyle;
  RightComponent?: React.ReactNode;
}) => {
  return (
    <Pressable style={[$detailsItem, style]} onPress={onPress}>
      <Icon icon={icon} style={{ marginRight: spacing.md }} size={sizing.xl} />
      <View style={$flex}>
        <Text style={{ color: colors.textDim }} size={"xs"}>
          {subtitle}
        </Text>
        <Text>{title}</Text>
      </View>
      {RightComponent}
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
