import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Stripe from "stripe";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { Icon } from "../Icon";
import { $row } from "../styles";
import { sizing } from "app/theme/sizing";
import { localizeCurrency } from "app/utils/general";
import { Button } from "../Button";
import functions from "@react-native-firebase/functions";
import { useAppSelector } from "app/redux/store";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import { AppLogo } from "../AppLogo";

interface Props {
  fullTimeProduct: Stripe.Product;
  surgeProduct: Stripe.Product;
  editable: boolean;
  subscription: Stripe.Subscription | null;
}

const FULL_TIME_ORDERS = 24;
const SURGE_ORDERS = 12;

export const SubscriptionSelect = ({
  fullTimeProduct,
  surgeProduct,
  editable,
  subscription,
}: Props) => {
  const updateSuccessModal = useRef<ModalRef>(null);

  const vendor = useAppSelector((state) => state.vendor.data);

  const fullTimeSubscriptionItem = useMemo(
    () =>
      subscription?.items.data.find(
        (i) => i.price.product === "prod_PvqVStGqKEDOhB"
      ),
    [subscription]
  );
  const surgeSubscriptionItem = useMemo(
    () =>
      subscription?.items.data.find(
        (i) => i.price.product === "prod_PwIMdMjpdkX6BU"
      ),
    [subscription]
  );

  const [subscriptionUpdating, setSubscriptionUpdating] = useState(false);
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [fullTimeQuantity, setFullTimeQuantity] = useState(
    fullTimeSubscriptionItem ? fullTimeSubscriptionItem.quantity || 1 : 1
  );
  const [surgeQuantity, setSurgeQuantity] = useState(
    surgeSubscriptionItem ? surgeSubscriptionItem.quantity || 0 : 0
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  const handlePayment = async () => {
    try {
      if (subscription && subscription.status !== "canceled") {
        const items: Stripe.SubscriptionUpdateParams["items"] = [
          {
            price: (fullTimeProduct.default_price as Stripe.Price).id,
            quantity: fullTimeQuantity,
            id: fullTimeSubscriptionItem?.id,
          },
          {
            id: surgeSubscriptionItem?.id,
            price: (surgeProduct.default_price as Stripe.Price).id,
            quantity: surgeQuantity,
          },
        ];

        const params: Stripe.SubscriptionUpdateParams = {
          items,
          cancel_at_period_end: false,
          proration_behavior: "create_prorations",
          cancellation_details: {},
        };
        setSubscriptionUpdating(true);
        await functions().httpsCallable("updateSubscription")({
          id: subscription.id,
          params,
        });
        updateSuccessModal.current?.open();
        setSubscriptionUpdating(false);
      } else {
        const lineItems = [
          {
            price: (fullTimeProduct.default_price as Stripe.Price).id,
            quantity: fullTimeQuantity,
          },
        ];

        if (surgeQuantity > 0) {
          lineItems.push({
            price: (surgeProduct.default_price as Stripe.Price).id,
            quantity: surgeQuantity,
          });
        }
        const data = await functions().httpsCallable("createCheckoutSession")({
          params: {
            line_items: lineItems,
            subscription_data: { metadata: { vendor: vendor?.id } },
            success_url: "http://localhost:8080",
            mode: "subscription",
          },
        });
        Linking.openURL(data.data.url);
        console.log(data.data);
      }
    } catch (error) {
      setSubscriptionUpdating(false);
      console.log("Failed to create payment link", error);
    }
  };

  if (!(fullTimeProduct && surgeProduct)) {
    return null;
  }

  const renderFullTimePrice = () => (
    <Text
      preset="subheading"
      style={{ marginTop: width <= 800 ? spacing.sm : 0 }}
    >
      (Qty {fullTimeQuantity}){" "}
      {localizeCurrency(
        (((fullTimeProduct.default_price as Stripe.Price)
          .unit_amount as number) *
          fullTimeQuantity) /
          100,
        "USD"
      )}
      /Month
    </Text>
  );

  const renderSurgePrice = () => (
    <Text
      preset="subheading"
      style={{ marginTop: width <= 800 ? spacing.sm : 0 }}
    >
      (Qty {surgeQuantity}){" "}
      {localizeCurrency(
        (((surgeProduct.default_price as Stripe.Price).unit_amount as number) *
          surgeQuantity) /
          100,
        "USD"
      )}
      /Month
    </Text>
  );

  const SubscriptionUpdating = useMemo(
    () =>
      subscriptionUpdating
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [subscriptionUpdating]
  );

  return (
    <View>
      <View style={$item}>
        <View style={$row}>
          <Icon
            icon="food"
            size={sizing.xl}
            color={colors.primary}
            style={{ marginRight: spacing.sm }}
          />
          <View style={{ flex: 1 }}>
            <Text preset="subheading">{fullTimeProduct.name}</Text>
            <Text>{fullTimeProduct.description}</Text>
          </View>

          {width > 800 && renderFullTimePrice()}
        </View>
        {width <= 800 && renderFullTimePrice()}
        <Text preset="bold" size={"lg"} style={{ marginTop: spacing.sm }}>
          {fullTimeQuantity * FULL_TIME_ORDERS} Orders a day &{" "}
          {fullTimeQuantity} Driver{fullTimeQuantity !== 1 ? "s" : ""}
        </Text>
        {editable && (
          <QuantitySelector
            disableDecrease={fullTimeQuantity === 1}
            changeQuantity={(n) => setFullTimeQuantity((q) => q + n)}
            style={{ marginTop: spacing.xs }}
          />
        )}
      </View>

      <View style={[$item, { marginTop: spacing.md }]}>
        <View style={$row}>
          <Icon
            icon="lightning-bolt"
            size={sizing.xl}
            color={colors.primary}
            style={{ marginRight: spacing.sm }}
          />
          <View style={{ flex: 1 }}>
            <Text preset="subheading">{surgeProduct.name}</Text>
            <Text>{surgeProduct.description}</Text>
          </View>
          {width > 800 && renderSurgePrice()}
        </View>
        {width <= 800 && renderSurgePrice()}
        <Text preset="bold" size={"lg"} style={{ marginTop: spacing.sm }}>
          {surgeQuantity * SURGE_ORDERS} Extra orders
        </Text>
        {editable && (
          <QuantitySelector
            disableDecrease={surgeQuantity === 0}
            changeQuantity={(n) => setSurgeQuantity((q) => q + n)}
            style={{ marginTop: spacing.xs }}
          />
        )}
      </View>
      <Button
        preset="filled"
        text={
          subscription && subscription.status !== "canceled"
            ? "Update Subscription"
            : editable
            ? "Confirm Orders"
            : "Subscribe"
        }
        style={$button}
        onPress={handlePayment}
        RightAccessory={SubscriptionUpdating}
      />
      <ReanimatedCenterModal ref={updateSuccessModal}>
        <View style={{ padding: spacing.md, alignItems: "center" }}>
          <AppLogo height={40} style={{ marginBottom: spacing.sm }} />
          <Text preset="heading">Subscription Updated</Text>
          <Text>Your changes go into effect immediately.</Text>
          <Button
            style={{ alignSelf: "stretch", marginTop: spacing.md }}
            preset="filled"
            onPress={() => updateSuccessModal.current?.close()}
            text="Continue"
          />
        </View>
      </ReanimatedCenterModal>
    </View>
  );
};

const QuantitySelector = ({
  changeQuantity,
  disableDecrease,
  style,
}: {
  changeQuantity: (change: number) => void;
  disableDecrease?: boolean;
  style?: ViewStyle;
}) => {
  return (
    <View style={[$row, style]}>
      <Pressable
        disabled={disableDecrease}
        style={[
          $quantityButton,
          { marginRight: spacing.xs, opacity: disableDecrease ? 0.5 : 1 },
        ]}
        onPress={() => changeQuantity(-1)}
      >
        <Icon icon="minus" />
        <Text selectable={false} style={$quantityButtonText}>
          Decrease
        </Text>
      </Pressable>
      <Pressable style={$quantityButton} onPress={() => changeQuantity(1)}>
        <Text selectable={false} style={$quantityButtonText}>
          Increase
        </Text>
        <Icon icon="plus" />
      </Pressable>
    </View>
  );
};

const $item: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.md,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
};
const $quantityButtonText: TextStyle = { marginHorizontal: spacing.xxs };
const $quantityButton: ViewStyle = {
  borderRadius: borderRadius.md,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.surface,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xs,
};
const $button: ViewStyle = {
  marginTop: spacing.lg,
};
