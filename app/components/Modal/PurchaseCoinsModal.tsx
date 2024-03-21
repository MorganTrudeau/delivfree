import React, { forwardRef, useContext, useRef, useState } from "react";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import Purchases, {
  PURCHASES_ERROR_CODE,
  PurchasesStoreProduct,
} from "react-native-purchases";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { useDebounce, useToast } from "app/hooks";
import { getProductInfo } from "app/utils/purchases";
import {
  CoinsPurchaseCompleteModal,
  CoinsPurchaseCompleteModalRef,
} from "./CoinsPurchaseCompleteModal";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { IosTerms } from "../IOSPurchaseTerms";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCombinedRefs } from "app/hooks/useCombinedRefs";
import { useAppSelector } from "app/redux/store";
import { Coins } from "../Coins";
import { PurchasesContext } from "app/context/PurchasesContext";
import { logAnalytics } from "app/services/firebase/analytics";
import { errorHasCode, errorHasMessage } from "app/utils/general";
import crashlytics from "@react-native-firebase/crashlytics";
import { $shadow, HORIZONTAL_SAFE_AREA_EDGES } from "../styles";
import { SafeAreaView } from "../SafeAreaView";
import { FadeInView } from "../FadeInView";
import { CoinsBenefits } from "../CoinsBenefits";
import { logAppsflyerEvent } from "app/utils/appsflyer";

export type PurchaseCoinsModalProps = { onPurchaseComplete?: () => void };

const ForwardRefPurchaseCoinsModal = forwardRef<
  BottomSheetRef,
  PurchaseCoinsModalProps
>(function PurchaseCoinsModal({ onPurchaseComplete }, ref) {
  const innerRef = useRef<BottomSheetRef>(null);

  const combinedRef = useCombinedRefs<BottomSheetRef>(ref, innerRef);

  const insets = useSafeAreaInsets();

  return (
    <BottomSheet ref={combinedRef} hideContentOnClose={false}>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.md,
        }}
      >
        <PurchaseCoins
          onPurchaseComplete={() => {
            innerRef.current?.close();
            onPurchaseComplete && onPurchaseComplete();
          }}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export const PurchaseCoinsModal = React.memo(ForwardRefPurchaseCoinsModal);

const PurchaseCoins = ({
  onPurchaseComplete,
}: {
  onPurchaseComplete: () => void;
}) => {
  const Toast = useToast();
  const purchasesContext = useContext(PurchasesContext);

  const purchaseCompleteModal = useRef<CoinsPurchaseCompleteModalRef>(null);

  const adminUser = useAppSelector((state) => state.user.admin);

  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const purchaseItem = async (product: PurchasesStoreProduct) => {
    try {
      if (purchaseLoading) {
        return;
      }

      if (adminUser) {
        return purchaseCompleteModal.current?.completePurchase(
          product.identifier
        );
      }

      setPurchaseLoading(true);

      const res = await Purchases.purchaseStoreProduct(product);

      logAppsflyerEvent("af_purchase", {
        af_revenue: product.price,
        af_currency: product.currencyCode,
      });
      logAnalytics("purchase_coins");

      setPurchaseLoading(false);

      purchaseCompleteModal.current?.completePurchase(res.productIdentifier);
    } catch (error: any) {
      console.log("Purchase error: ", error);
      setPurchaseLoading(false);
      if (
        errorHasCode(error) &&
        error.code !== PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
      ) {
        Toast.show("Could not complete your purchase. Please try again.");
        crashlytics().recordError(
          new Error(errorHasMessage(error) ? error.message : error.code)
        );
      } else {
        crashlytics().recordError(new Error(error));
      }
    }
  };

  return (
    <SafeAreaView style={$content} edges={HORIZONTAL_SAFE_AREA_EDGES}>
      <Text preset="heading" style={$heading}>
        Purchase Coins
      </Text>
      <Text style={$message}>
        Add coins to your account to collect badges, buy power ups and skip ads.
      </Text>
      {!purchasesContext.products.length && (
        <ActivityIndicator color={colors.primary} />
      )}
      {purchasesContext.products.map((p, index) => {
        const lastItem = index === purchasesContext.products.length - 1;
        return (
          <CoinPurchaseItem
            key={p.identifier}
            product={p}
            onPurchase={purchaseItem}
            style={lastItem ? undefined : $purchaseItemMargin}
          />
        );
      })}

      <CoinsBenefits />

      <IosTerms style={$iosTerms} />

      {purchaseLoading && (
        <FadeInView style={$loadingOverlay}>
          <View style={$indicatorWrapper}>
            <ActivityIndicator size="large" color={colors.text} />
          </View>
        </FadeInView>
      )}

      <CoinsPurchaseCompleteModal
        ref={purchaseCompleteModal}
        onCompleted={onPurchaseComplete}
      />
    </SafeAreaView>
  );
};

const CoinPurchaseItem = ({
  product,
  onPurchase,
  style,
}: {
  product: PurchasesStoreProduct;
  onPurchase: (product: PurchasesStoreProduct) => void;
  style?: ViewStyle;
}) => {
  const productInfo = getProductInfo(product.identifier);

  const debounce = useDebounce(1000);

  return (
    <Pressable
      style={[$purchaseItem, style]}
      onPress={debounce(() => onPurchase(product))}
    >
      <Coins coins={productInfo.formattedValue} style={$coins} />
      <View style={$purchaseText}>
        {/* <Text preset="subheading">{productInfo.title}</Text> */}
        {/* <Text>{product.description}</Text> */}
      </View>
      <Text preset="subheading" size={"xl"}>
        {product.priceString}
      </Text>

      {!!productInfo.discount && (
        <View
          style={[
            $discountBubble,
            productInfo.discount === 20 && $maxDiscountBubble,
          ]}
        >
          <Text style={productInfo.discount !== 20 ? $discount : $maxDiscount}>
            {productInfo.discount}% Off
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const $coins: ViewStyle = {
  // backgroundColor: colors.palette.neutral300,
  // paddingVertical: 0,
  borderColor: colors.palette.primary400,
};

const $heading: TextStyle = {
  marginBottom: spacing.xs,
};

const $message: TextStyle = { marginBottom: spacing.lg };

const $discountBubble: ViewStyle = {
  borderRadius: 5,
  backgroundColor: colors.text,
  position: "absolute",
  bottom: -11,
  right: -6,
  paddingHorizontal: spacing.xxs,
};
const $discount: TextStyle = {
  color: "#fff",
};
const $maxDiscountBubble: ViewStyle = {
  backgroundColor: colors.success,
};
const $maxDiscount: TextStyle = {
  color: colors.text,
};

const $purchaseText: ViewStyle = {
  flex: 1,
  paddingEnd: spacing.sm,
};

const $purchaseItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: spacing.sm,
  borderRadius: 10,
  backgroundColor: colors.surface,
};

const $purchaseItemMargin: ViewStyle = {
  marginBottom: spacing.md,
};

const $content: ViewStyle = {
  padding: spacing.md,
};

const $iosTerms: ViewStyle = {
  marginTop: spacing.md,
};

const $loadingOverlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(238, 208, 191, 0.5)",
  alignItems: "center",
  paddingTop: spacing.xl,
};

const $indicatorWrapper: ViewStyle = {
  backgroundColor: colors.background,
  ...$shadow,
  padding: spacing.md,
  borderRadius: 4,
};
