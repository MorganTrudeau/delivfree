import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Platform,
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
import { useAlert } from "app/hooks";
import {
  FULL_TIME_ORDERS,
  PART_TIME_ORDERS,
  isFullTimeOrderItem,
  isSurgeOrderItem,
} from "app/utils/subscriptions";
import { QuantitySelector } from "../QuantitySelector";
import { createStripeCheckoutSession } from "app/apis/stripe";
import { navigationRef } from "app/navigators";
import { VENDOR_DOMAIN } from "functions/src/types";

interface Props {
  fullTimeProduct: Stripe.Product;
  surgeProduct: Stripe.Product;
  subscription: Stripe.Subscription | null | undefined;
  referenceSubscription?: Stripe.Subscription | null;
}

export const SubscriptionSelect = ({
  fullTimeProduct,
  surgeProduct,
  subscription,
  referenceSubscription,
}: Props) => {
  const Alert = useAlert();

  const updateSuccessModal = useRef<ModalRef>(null);

  const vendor = useAppSelector((state) => state.vendor.activeVendor);
  const driver = useAppSelector((state) => state.driver.activeDriver);
  const userType = useAppSelector((state) => state.appConfig.userType);
  const user = useAppSelector((state) => state.auth.user);

  const fullTimeSubscriptionItem = useMemo(
    () =>
      (referenceSubscription || subscription)?.items.data.find(
        isFullTimeOrderItem
      ),
    [referenceSubscription, subscription]
  );
  const surgeSubscriptionItem = useMemo(
    () =>
      (referenceSubscription || subscription)?.items.data.find(
        isSurgeOrderItem
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

  const subscriptionChanged =
    surgeQuantity !== surgeSubscriptionItem?.quantity ||
    fullTimeQuantity !== fullTimeSubscriptionItem?.quantity;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  const handlePayment = async () => {
    try {
      const metadata: { [key: string]: string } = {};

      if (userType === "driver" && driver?.id) {
        metadata.driver = driver.id;
      } else if (userType === "vendor" && vendor?.id) {
        metadata.vendor = vendor.id;
      } else {
        throw "missing required parameter";
      }

      setSubscriptionUpdating(true);

      if (subscription && subscription.status !== "canceled") {
        const items: Stripe.SubscriptionUpdateParams["items"] = [
          {
            price: (fullTimeProduct.default_price as Stripe.Price).id,
            quantity: fullTimeQuantity,
            id: fullTimeSubscriptionItem?.id,
          },
        ];

        if (surgeQuantity || surgeSubscriptionItem) {
          const surgeItem: Stripe.SubscriptionUpdateParams.Item = {
            price: (surgeProduct.default_price as Stripe.Price).id,
            quantity: surgeQuantity,
          };
          if (surgeSubscriptionItem) {
            surgeItem.id = surgeSubscriptionItem.id;
          }
          items.push(surgeItem);
        }

        const params: Stripe.SubscriptionUpdateParams = {
          items,
          cancel_at_period_end: false,
          proration_behavior: "create_prorations",
          cancellation_details: {},
          metadata,
        };
        await functions().httpsCallable("updateSubscription")({
          id: subscription.id,
          params,
        });
        updateSuccessModal.current?.open();
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

        const params: Stripe.Checkout.SessionCreateParams = {
          line_items: lineItems,
          subscription_data: { metadata },
          success_url:
            Platform.OS === "web"
              ? __DEV__
                ? "http://localhost:8080"
                : VENDOR_DOMAIN
              : "https://mobileredirect-5vakg2iqja-uc.a.run.app", // "delivfree://subscription", // @todo change
          mode: "subscription",
          ui_mode: "embedded",
          customer_email: user?.email || undefined,
        };
        const session = await createStripeCheckoutSession(params);
        if (session && session.client_secret) {
          navigationRef.current?.navigate("Payment", {
            clientSecret: session.client_secret,
          });
        }
      }
      setSubscriptionUpdating(false);
    } catch (error) {
      setSubscriptionUpdating(false);
      console.log("Failed to create payment link", error);
      Alert.alert("Something went wrong", "Please try that again.");
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
        {!referenceSubscription && (
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
          {surgeQuantity * PART_TIME_ORDERS} Extra orders
        </Text>
        {!referenceSubscription && (
          <QuantitySelector
            disableDecrease={surgeQuantity === 0}
            changeQuantity={(n) => setSurgeQuantity((q) => q + n)}
            style={{ marginTop: spacing.xs }}
          />
        )}
      </View>
      {(!referenceSubscription || !subscription) && (
        <Button
          disabled={!subscriptionChanged && !referenceSubscription}
          preset={
            subscriptionChanged || referenceSubscription ? "filled" : "default"
          }
          text={
            subscription && subscription.status !== "canceled"
              ? "Update Subscription"
              : !referenceSubscription
              ? "Confirm Orders"
              : "Subscribe"
          }
          style={$button}
          onPress={handlePayment}
          RightAccessory={SubscriptionUpdating}
        />
      )}
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

const $item: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.md,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  width: "100%",
};
const $button: ViewStyle = {
  marginTop: spacing.lg,
};
