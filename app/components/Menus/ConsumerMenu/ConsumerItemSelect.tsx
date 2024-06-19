import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import ReanimatedCenterModal, {
  ModalRef,
} from "app/components/Modal/CenterModal";
import { QuantitySelector } from "app/components/QuantitySelector";
import { Text } from "app/components/Text";
import { Toggle } from "app/components/Toggle";
import {
  $borderBottomLight,
  $borderTop,
  $flex,
  $row,
  isLargeScreen,
} from "app/components/styles";
import { useAlert } from "app/hooks";
import { useDimensions } from "app/hooks/useDimensions";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import {
  CheckoutItem,
  CheckoutItemCustomization,
  addItemToCart,
  startCart,
} from "app/redux/reducers/checkoutCart";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { generateUid, localizeCurrency } from "app/utils/general";
import { MenuCustomizationChoice, MenuItem } from "delivfree/types";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";

interface Props {
  item: MenuItem;
  vendor: string;
  vendorLocation: string;
  onClose: () => void;
}

const ConsumerItemSelect = ({
  vendor,
  vendorLocation,
  item,
  onClose,
}: Props) => {
  const Alert = useAlert();

  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const cartOrder = useAppSelector((state) => state.checkoutCart.order);
  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const dispatch = useAppDispatch();

  const { customizations, customizationsLoaded, loadCustomizations } =
    useMenusLoading({ item: item.id });

  useEffect(() => {
    loadCustomizations(false);
  }, []);

  const imageSource = useMemo(() => ({ uri: item.image }), []);

  const [quantity, setQuantity] = useState(1);
  const [customizationChoices, setCustomizationChoices] = useState<{
    [customizationId: string]: {
      choice: MenuCustomizationChoice;
      quantity: number;
      text: string;
    }[];
  }>({});

  const totalPrice = useMemo(() => {
    return (
      Number(item.price) * quantity +
      Object.values(customizationChoices).reduce((acc, choices) => {
        return (
          acc + choices.reduce((acc, c) => acc + Number(c.choice.price), 0)
        );
      }, 0)
    );
  }, [quantity, item.price, customizationChoices]);

  const handleAddItemToCart = () => {
    const checkoutItem: CheckoutItem = {
      id: generateUid(),
      item,
      quantity,
      customizations: Object.entries(customizationChoices).reduce(
        (acc, [customization, choices]) => {
          return [...acc, ...choices.map((c) => ({ ...c, customization }))];
        },
        [] as CheckoutItemCustomization[]
      ),
    };
    const newCart = {
      id: generateUid(),
      customer: authToken,
      vendor,
      vendorLocation,
      items: [checkoutItem],
    };
    if (cartOrder) {
      if (
        cartOrder.vendor === vendor &&
        cartOrder.vendorLocation === vendorLocation
      ) {
        dispatch(addItemToCart(checkoutItem));
      } else {
        Alert.alert(
          "Create new order?",
          "Your cart has an order from a different restaurant. Create a new order for this restaurant?",
          [
            { text: "Cancel", onPress: () => {} },
            {
              text: "New order",
              onPress: () => {
                dispatch(startCart(newCart));
              },
            },
          ]
        );
      }
    } else {
      dispatch(startCart(newCart));
    }
    onClose();
  };

  return (
    <View style={largeScreen && { flexDirection: "row" }}>
      <FastImage source={imageSource} style={$image} />
      <View style={{ padding: spacing.md, flex: 1 }}>
        <Text preset="heading">{item.name}</Text>
        <Text size={"md"} style={{ color: colors.textDim }}>
          {localizeCurrency(Number(item.price), "CAD")}
        </Text>
        {!!item.description && (
          <Text style={{ color: colors.textDim }}>{item.description}</Text>
        )}

        {!customizationsLoaded && <ActivityIndicator color={colors.primary} />}
        {customizations.length > 0 && (
          <View style={{ marginTop: spacing.sm }}>
            {customizations.map((customization) => {
              return (
                <View style={[$borderTop, { paddingTop: spacing.sm }]}>
                  <Text preset="subheading">{customization.name}</Text>
                  {Number(customization.minChoices) > 0 && (
                    <Text style={{ color: colors.textDim }} size={"xs"}>
                      Required
                    </Text>
                  )}
                  {customization.choices.map((choice, index, arr) => {
                    const selected = !!customizationChoices[
                      customization.id
                    ]?.find((c) => c.choice.id === choice.id);
                    return (
                      <Pressable
                        onPress={() => {
                          setCustomizationChoices((s) => {
                            const _customization = s[customization.id];
                            if (_customization) {
                              if (selected) {
                                return {
                                  ...s,
                                  [customization.id]: s[
                                    customization.id
                                  ].filter((c) => c.choice.id !== choice.id),
                                };
                              }
                              const max = Number(customization.maxChoices);
                              const choices =
                                max && _customization.length >= max
                                  ? [..._customization].slice(1, max)
                                  : _customization.slice();
                              return {
                                ...s,
                                [customization.id]: [
                                  ...choices,
                                  {
                                    choice,
                                    quantity: 1,
                                    text: "",
                                  },
                                ],
                              };
                            } else {
                              return {
                                ...s,
                                [customization.id]: [
                                  {
                                    choice,
                                    quantity: 1,
                                    text: "",
                                  },
                                ],
                              };
                            }
                          });
                        }}
                        style={[
                          { paddingVertical: spacing.xs },
                          $row,
                          $borderBottomLight,
                          index === arr.length - 1 && { borderBottomWidth: 0 },
                        ]}
                      >
                        <View style={$flex}>
                          <Text>{choice.name}</Text>
                          {!!choice.price && Number(choice.price) && (
                            <Text size={"xs"}>
                              +{localizeCurrency(Number(choice.price), "CAD")}
                            </Text>
                          )}
                        </View>
                        <Toggle value={selected} />
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}

        <View
          style={[
            $borderTop,
            $row,
            { paddingTop: spacing.sm, marginTop: spacing.sm },
          ]}
        >
          <Text preset="semibold" style={{ marginRight: spacing.sm }}>
            Quantity x {quantity}
          </Text>
          <QuantitySelector
            changeQuantity={(change) =>
              setQuantity((q) => Math.max(1, q + change))
            }
            disableDecrease={quantity <= 1}
            simplified
          />
        </View>

        <Button
          text={`Add ${quantity} to order • ${localizeCurrency(
            totalPrice,
            "CAD"
          )}`}
          preset="reversed"
          style={{ marginTop: spacing.lg }}
          onPress={handleAddItemToCart}
        />
      </View>
    </View>
  );
};

export const ConsumerItemSelectModal = forwardRef<
  ModalRef,
  Omit<Props, "item"> & {
    item: MenuItem | null | undefined;
  }
>(function ConsumerItemSelectModal(props, ref) {
  return (
    <ReanimatedCenterModal
      ref={ref}
      contentStyle={{ maxWidth: 1000, alignSelf: "center" }}
    >
      <View
        style={{
          paddingTop: spacing.md,
          paddingHorizontal: spacing.md,
          alignItems: "flex-start",
        }}
      >
        <Icon icon="close" onPress={props.onClose} />
      </View>
      {props.item && <ConsumerItemSelect {...props} item={props.item} />}
    </ReanimatedCenterModal>
  );
});

const $image: ImageStyle = {
  flex: 1,
  aspectRatio: 1,
  maxWidth: 500,
  margin: spacing.md,
  borderRadius: borderRadius.md,
};
