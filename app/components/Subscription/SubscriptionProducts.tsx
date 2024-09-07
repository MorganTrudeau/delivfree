import React, { useEffect, useState } from "react";
import Stripe from "stripe";
import functions from "@react-native-firebase/functions";
import { SubscriptionSelect } from "./SubscriptionSelect";
import { ActivityIndicator } from "react-native";
import { colors } from "app/theme";
import { Text } from "../Text";
import { Button } from "../Button";

interface Props {
  subscription: Stripe.Subscription | null | undefined;
  referenceSubscription?: Stripe.Subscription | null;
}

export const SubscriptionProducts = ({
  subscription,
  referenceSubscription,
}: Props) => {
  const [{ loading, error }, setLoadingState] = useState({
    loading: false,
    error: false,
  });

  const [{ fullTimeProduct, surgeProduct }, setProducts] = useState<{
    fullTimeProduct: Stripe.Product | undefined;
    surgeProduct: Stripe.Product | undefined;
  }>({ fullTimeProduct: undefined, surgeProduct: undefined });

  const loadProducts = async () => {
    try {
      setLoadingState({ loading: true, error: false });
      const res = await functions().httpsCallable<
        { params: Stripe.ProductListParams },
        Stripe.ApiList<Stripe.Product>
      >("fetchProducts")({
        params: { expand: ["data.default_price"] },
      });
      const data = res.data;
      const _products = data.data.sort(
        (a, b) =>
          ((b.default_price as Stripe.Price).unit_amount as number) -
          ((a.default_price as Stripe.Price).unit_amount as number)
      );
      const _fullTimeProduct = data.data.find(
        (p) => p.metadata.type === "full-time"
      );
      const _surgeProduct = data.data.find((p) => p.metadata.type === "surge");
      setProducts({
        fullTimeProduct: _fullTimeProduct,
        surgeProduct: _surgeProduct,
      });
      setLoadingState({ loading: false, error: false });
      console.log(_products);
    } catch (error) {
      setLoadingState({ loading: false, error: true });
      console.log("Failed to load subscriptions", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      {loading && <ActivityIndicator color={colors.primary} />}
      {error && (
        <>
          <Text>There was a problem loading plans. Please try again.</Text>
          <Button preset="filled" text={"Load Plans"} />
        </>
      )}
      {fullTimeProduct && surgeProduct && (
        <SubscriptionSelect
          fullTimeProduct={fullTimeProduct}
          surgeProduct={surgeProduct}
          subscription={subscription}
          referenceSubscription={referenceSubscription}
        />
      )}
    </>
  );
};
