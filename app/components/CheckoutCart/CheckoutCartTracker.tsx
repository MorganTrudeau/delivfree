import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";
import { Icon } from "../Icon";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { PopoverButton } from "../Popover/PopoverButton";
import { borderRadius } from "app/theme/borderRadius";
import { fetchVendorLocation } from "app/apis/vendorLocations";
import { $borderBottom, $borderBottomLight, $row } from "../styles";
import { QuantitySelectorInline } from "../QuantitySelectorInline";
import {
  CheckoutItem,
  changeCartItemQuantity,
  emptyCart,
} from "app/redux/reducers/checkoutCart";
import { useDimensions } from "app/hooks/useDimensions";
import { localizeCurrency } from "app/utils/general";
import { Button } from "../Button";
import { PopoverContext } from "../Popover/PopoverContext";
import { navigationRef } from "app/navigators";
import { CartItem } from "./CartItem";

export const CheckoutCartTracker = () => {
  const cart = useAppSelector((state) => state.checkoutCart.order);

  const { width } = useDimensions();
  const containerWidth = Math.min(500, width - spacing.md * 2);

  const popoverContent = useContext(PopoverContext);

  const handleCheckout = () => {
    popoverContent.dismissPopover();
    navigationRef.navigate("Checkout");
  };

  const renderPopover = useCallback(() => {
    return (
      <Pressable
        style={{
          padding: spacing.md,
          borderRadius: borderRadius.md,
          backgroundColor: colors.background,
          width: containerWidth,
        }}
      >
        <Icon icon={"close"} onPress={() => popoverContent.dismissPopover()} />
        <CartItems onCheckout={handleCheckout} />
      </Pressable>
    );
  }, []);

  return (
    <PopoverButton renderPopover={renderPopover} position="topRight">
      <>
        <Icon icon={"cart-outline"} size={sizing.xl} />
        <View style={$numberBubble}>
          <Text style={{ color: "#fff" }} size={"xs"} allowFontScaling={false}>
            {cart?.items.length || 0}
          </Text>
        </View>
      </>
    </PopoverButton>
  );
};

const CartItems = ({ onCheckout }: { onCheckout: () => void }) => {
  const { height } = useDimensions();

  const cart = useAppSelector((state) => state.checkoutCart.order);
  const vendorLocations = useAppSelector((state) => state.vendorLocations.data);
  const dispatch = useAppDispatch();

  const cartVendorLocation = cart?.vendorLocation;

  const [vendorLocation, setVendorLocation] = useState(
    cartVendorLocation ? vendorLocations[cartVendorLocation] : undefined
  );

  useEffect(() => {
    if (cartVendorLocation && !vendorLocation) {
      const loadVendorData = async () => {
        try {
          const data = await fetchVendorLocation(cartVendorLocation);
          setVendorLocation(data);
        } catch (error) {
          console.log("Failed to load cart vendor location", error);
        }
      };
      loadVendorData();
    }
  }, [cartVendorLocation, vendorLocation]);

  const handleChangeQuantity = (cartItem: string, quantity: number) => {
    dispatch(changeCartItemQuantity({ id: cartItem, quantity: quantity }));
  };

  const cartItems = cart?.items;
  const subtotal = useMemo(() => {
    if (!cartItems) {
      return 0;
    }

    return cartItems.reduce((subtotalAcc, item) => {
      const itemPrice =
        Number(item.item.price) * item.quantity +
        item.customizations.reduce((acc, choice) => {
          return acc + (Number(choice.choice.price) || 0) * choice.quantity;
        }, 0);

      return subtotalAcc + itemPrice;
    }, 0);
  }, [cartItems]);

  if (!cartItems?.length) {
    return <EmptyCart />;
  }

  return (
    <View style={{ paddingTop: spacing.sm }}>
      {vendorLocation && (
        <>
          <Text preset="heading">{vendorLocation?.name}</Text>
          <Text style={{ color: colors.textDim }}>
            {vendorLocation?.address}
          </Text>
        </>
      )}
      <View
        style={[
          $row,
          $borderBottomLight,
          {
            justifyContent: "space-between",
            paddingBottom: spacing.xs,
            paddingTop: spacing.md,
          },
        ]}
      >
        <Text>{cartItems.length} Items</Text>
        <Text>
          Subtotal:{" "}
          <Text preset="semibold">{localizeCurrency(subtotal, "CAD")}</Text>
        </Text>
      </View>
      <ScrollView
        style={{ flex: 1, maxHeight: Math.min(height - 150, 500) }}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.map((item, itemIndex, itemsArr) => {
          return (
            <CartItem
              key={`checkout-item-${item.id}`}
              item={item}
              style={
                itemIndex !== itemsArr.length - 1
                  ? undefined
                  : { borderBottomWidth: 0 }
              }
              onChangeQuantity={handleChangeQuantity}
            />
          );
        })}
      </ScrollView>
      <Button
        preset="reversed"
        text="Go to checkout"
        style={{ marginTop: spacing.md }}
        onPress={onCheckout}
      />
    </View>
  );
};

const EmptyCart = () => (
  <View
    style={{
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: 300,
    }}
  >
    <Icon icon={"cart"} size={sizing.xxl} />
    <Text
      style={{
        color: colors.textDim,
        marginTop: spacing.sm,
        textAlign: "center",
      }}
    >
      Add items from a restaurant or store to start a new cart
    </Text>
  </View>
);

const BUBBLE_SIZE = 20;
const $numberBubble: ViewStyle = {
  height: BUBBLE_SIZE,
  width: BUBBLE_SIZE,
  borderRadius: BUBBLE_SIZE / 2,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.primary,
  position: "absolute",
  top: -BUBBLE_SIZE / 4,
  right: -BUBBLE_SIZE / 4,
};
