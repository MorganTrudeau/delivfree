import { CheckoutItem } from "delivfree";
import React, { useRef } from "react";
import { Card } from "../Card";
import { Pressable, View } from "react-native";
import { Text } from "../Text";
import { spacing } from "app/theme";
import { CartItem } from "./CartItem";
import { pluralFormat } from "app/utils/general";
import { Icon } from "../Icon";
import { $row } from "../styles";
import { BottomSheet, BottomSheetRef } from "../Modal/BottomSheet";

export const CartItemsModal = ({
  items,
  startOpen,
}: {
  items: CheckoutItem[];
  startOpen?: boolean;
}) => {
  const modal = useRef<BottomSheetRef>(null);

  const isOpen = useRef(!!startOpen);

  const open = () => {
    isOpen.current = true;
    modal.current?.snapToIndex(0);
  };

  const close = () => {
    isOpen.current = false;
    modal.current?.collapse();
  };

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
        <Icon icon={"chevron-down"} />
      </Pressable>

      <BottomSheet ref={modal}>
        <View style={{ padding: spacing.md }}>
          <Text preset="subheading" style={{ marginBottom: spacing.md }}>
            Cart summary ({items.length} {pluralFormat("item", items.length)})
          </Text>
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
      </BottomSheet>
    </Card>
  );
};
