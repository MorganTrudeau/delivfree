import React from "react";
import { fetchVendorLocationDetail } from "app/apis/vendorLocations";
import { changeCartItemQuantity } from "app/redux/reducers/checkoutCart";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { calcCheckoutOrderSubtotal } from "app/utils/checkout";
import { useEffect, useMemo, useState } from "react";
import { EmptyCart } from "./EmptyCart";
import { colors, spacing } from "app/theme";
import { ScrollView, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { $borderBottomLight, $row } from "../styles";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import { CartItem } from "./CartItem";
import { Button } from "../Button";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Icon } from "../Icon";
import { isTestUser } from "app/redux/selectors";

export const CheckoutCart = ({
  onCheckout,
  style,
}: {
  onCheckout: () => void;
  style?: ViewStyle;
}) => {
  const testUser = useAppSelector(isTestUser);
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
          const data = await fetchVendorLocationDetail(
            cartVendorLocation,
            testUser
          );
          if (data) {
            setVendorLocation(data);
          }
        } catch (error) {
          console.log("Failed to load cart vendor location", error);
        }
      };
      loadVendorData();
    }
  }, [cartVendorLocation, vendorLocation]);

  const handleChangeQuantity = (cartItem: string, quantity: number) => {
    dispatch(changeCartItemQuantity({ id: cartItem, quantity }));
  };

  const cartItems = cart?.items;
  const subtotal = useMemo(() => {
    if (!cartItems) {
      return 0;
    }

    return calcCheckoutOrderSubtotal(cartItems);
  }, [cartItems]);

  const ButtonIcon = useMemo(
    () =>
      ({ style }) =>
        <Icon icon={"arrow-right"} color={"#fff"} style={style} />,
    []
  );

  if (!cartItems?.length) {
    return <EmptyCart />;
  }

  return (
    <View style={[{ flex: 1 }, style]}>
      <LoadingPlaceholder loading={!vendorLocation} height={30}>
        <Text preset="heading">{vendorLocation?.name}</Text>
      </LoadingPlaceholder>
      {!vendorLocation && <View style={{ height: spacing.xs }} />}
      <LoadingPlaceholder loading={!vendorLocation} height={20}>
        <Text style={{ color: colors.textDim }}>{vendorLocation?.address}</Text>
      </LoadingPlaceholder>

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
        <Text>
          {cartItems.length} {pluralFormat("Item", cartItems.length)}
        </Text>
        <Text>
          Subtotal:{" "}
          <Text preset="semibold">{localizeCurrency(subtotal, "CAD")}</Text>
        </Text>
      </View>
      <ScrollView
        style={[{ flex: 1 }, $borderBottomLight]}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.sm }}
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
        RightAccessory={ButtonIcon}
      />
    </View>
  );
};
