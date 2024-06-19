import { useLayout } from "app/hooks";
import { CheckoutItem } from "delivfree/types";
import React, { useRef } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Card } from "../Card";
import { Pressable, View } from "react-native";
import { Text } from "../Text";
import { spacing } from "app/theme";
import { CartItem } from "./CartItem";
import { pluralFormat } from "app/utils/general";
import { Icon } from "../Icon";
import { $row } from "../styles";

export const CartItemsDropDown = ({
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
