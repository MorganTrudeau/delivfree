import React, {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ReanimatedModal } from "./ReanimatedModal";
import { ModalRef } from "functions/src/types";
import { Text } from "../Text";
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { colors, spacing } from "app/theme";
import { $row } from "../styles";
import { Button } from "../Button";
import { CoinsBenefits } from "../CoinsBenefits";
import { PurchasesContext } from "app/context/PurchasesContext";
import Purchases, {
  PURCHASES_ERROR_CODE,
  PurchasesStoreProduct,
} from "react-native-purchases";
import { useAlert, useToast } from "app/hooks";
import { logAnalytics } from "app/services/firebase/analytics";
import { increaseCoins } from "app/apis/coins";
import { useAppSelector } from "app/redux/store";
import { useCombinedRefs } from "app/hooks/useCombinedRefs";
import crashlytics from "@react-native-firebase/crashlytics";
import { errorHasCode, errorHasMessage, retryRequest } from "app/utils/general";
import { logAppsflyerEvent } from "app/utils/appsflyer";
import { Icon } from "../Icon";

const CoinsOffer = ({ onClose }: { onClose: () => void }) => {
  const purchases = useContext(PurchasesContext);
  const Alert = useAlert();
  const Toast = useToast();

  const user = useAppSelector((state) => state.user.user);

  const [loading, setLoading] = useState(false);

  const [saleProduct, setSaleProduct] = useState<PurchasesStoreProduct>();

  useEffect(() => {
    const loadSaleProduct = async () => {
      try {
        const _saleProduct = await retryRequest(async () => {
          const products = await Purchases.getProducts([
            "com.smarticus.5000_sale",
          ]);
          if (!products[0]) {
            throw new Error("missing product");
          }
          return products[0];
        });

        if (_saleProduct) {
          setSaleProduct(_saleProduct);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadSaleProduct();
  }, []);

  const claimOffer = async () => {
    if (!(saleProduct && user?.id)) {
      purchases.loadProducts();
      return Alert.alert("Something went wrong", "Please try that again.");
    }

    try {
      setLoading(true);

      await Purchases.purchaseStoreProduct(saleProduct);

      increaseCoins(user.id, 5000);

      logAppsflyerEvent("af_purchase", {
        af_revenue: saleProduct.price,
        af_currency: saleProduct.currencyCode,
      });
      logAnalytics("coins_sale");

      setLoading(false);
      onClose();
      Toast.show("5000 coins added to your account");
    } catch (error: any) {
      console.log("Purchase error: ", error);
      setLoading(false);
      if (
        errorHasCode(error) &&
        error.code !== PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
      ) {
        Toast.show("Could not complete your purchase. Please try again.");
        crashlytics().recordError(
          new Error(errorHasMessage(error) ? error.message : error.code)
        );
      } else {
        crashlytics().recordError(error);
      }
    }
  };

  const CheckIcon = useMemo(
    () =>
      function CheckIcon({ style }) {
        return <Icon icon="check-circle" style={style} />;
      },
    []
  );

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator color={colors.text} style={style} />
        : undefined,
    [loading]
  );

  return (
    <View style={$content}>
      <Text preset={"heading"} size={"xxl"} weight="bold" style={$header}>
        One Time Offer
      </Text>

      <AnimatedLottieView
        source={require("../../../assets/lottie/coins-lottie.json")}
        style={$lottie}
        autoPlay
      />

      <View style={[$row, $offerContainer]}>
        <Text style={$offerText} preset="subheading" weight="bold">
          5000 coins
        </Text>
        <View style={$imageContainer}>
          <Image
            source={require("../../../assets/images/80-percent.png")}
            style={$percentImage}
          />
        </View>

        <Text style={$offerText} preset="subheading" weight="bold">
          Off!
        </Text>
      </View>

      <Button
        text="Claim Offer"
        style={$claimButton}
        preset="filled"
        onPress={claimOffer}
        LeftAccessory={CheckIcon}
        RightAccessory={Loading}
      />

      <CoinsBenefits headingStyle={$header} lightStyle />
    </View>
  );
};

export const CoinsOfferModal = forwardRef<ModalRef>(function CoinsOfferModal(
  _,
  ref
) {
  const innerRef = useRef<ModalRef>(null);

  const combinedRef = useCombinedRefs(ref, innerRef);

  return (
    <ReanimatedModal
      ref={combinedRef}
      containerStyle={$container}
      showCloseButton
      tapToDismiss={false}
    >
      <CoinsOffer onClose={() => innerRef.current?.close()} />
    </ReanimatedModal>
  );
});

const LOTTIE_SIZE = 150;
const PERCENT_IMAGE = 60;

const $header: TextStyle = {
  alignSelf: "center",
};

const $lottie: ViewStyle = {
  height: LOTTIE_SIZE,
  width: LOTTIE_SIZE,
  alignSelf: "center",
};

const $container: ViewStyle = {};

const $content: ViewStyle = {
  paddingVertical: spacing.lg,
  padding: spacing.lg,
};

const $offerContainer: ViewStyle = {
  backgroundColor: colors.text,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xs,
  marginTop: spacing.sm,
  borderRadius: 3,
  alignSelf: "center",
};

const $offerText: TextStyle = {
  color: "white",
};

const $imageContainer: ViewStyle = {
  width: PERCENT_IMAGE,
  marginHorizontal: spacing.xs,
};

const $percentImage: ImageStyle = {
  height: PERCENT_IMAGE,
  width: PERCENT_IMAGE,
  position: "absolute",
  bottom: -PERCENT_IMAGE / 4,
};

const $claimButton: ViewStyle = {
  alignSelf: "stretch",
  marginTop: spacing.lg,
  marginBottom: spacing.sm,
};
