import React, { useCallback, useRef } from "react";
import { Platform, Pressable, View, ViewStyle } from "react-native";
import { Icon } from "../Icon";
import { useAppSelector } from "app/redux/store";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { PopoverButton, PopoverRef } from "../Popover/PopoverButton";
import { borderRadius } from "app/theme/borderRadius";
import { useDimensions } from "app/hooks/useDimensions";
import { navigationRef } from "app/navigators";
import { useOnChange } from "app/hooks";
import { CheckoutCart } from "./CheckoutCart";

export const CheckoutCartTracker = ({
  color = colors.text,
}: {
  color?: string;
}) => {
  const cart = useAppSelector((state) => state.checkoutCart.order);

  const popover = useRef<PopoverRef>(null);

  const handleCheckout = () => {
    popover.current?.dismiss();
    navigationRef.navigate("Checkout");
  };

  useOnChange(cart?.items, (next, prev) => {
    console.log({ prev, next });
    if (!prev?.length && next?.length) {
      popover.current?.open();
    }
  });

  const renderPopover = useCallback(() => {
    return (
      <CartItemsContainer>
        <Icon icon={"close"} onPress={() => popover.current?.dismiss()} />
        <CheckoutCart
          onCheckout={handleCheckout}
          style={{ paddingTop: spacing.sm }}
        />
      </CartItemsContainer>
    );
  }, []);

  const renderButtonContent = () => {
    return (
      <>
        <Icon icon={"cart-outline"} size={sizing.xl} color={color} />
        <View style={$numberBubble}>
          <Text style={{ color: "#fff" }} size={"xs"} allowFontScaling={false}>
            {cart?.items.length || 0}
          </Text>
        </View>
      </>
    );
  };

  if (Platform.OS !== "web") {
    return (
      <Pressable
        onPress={() => navigationRef.current?.navigate("CheckoutCart")}
      >
        {renderButtonContent()}
      </Pressable>
    );
  }

  return (
    <PopoverButton
      ref={popover}
      renderPopover={renderPopover}
      position="topRight"
    >
      {renderButtonContent()}
    </PopoverButton>
  );
};

const CartItemsContainer = ({ children }: { children: React.ReactNode }) => {
  const { width } = useDimensions();
  const containerWidth = Math.min(500, width - spacing.md * 2);

  return (
    <Pressable
      style={{
        padding: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background,
        width: containerWidth,
      }}
    >
      {children}
    </Pressable>
  );
};

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
