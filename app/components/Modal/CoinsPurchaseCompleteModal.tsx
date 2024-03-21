import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import AnimatedLottieView from "lottie-react-native";
import { ModalRef, User } from "smarticus";
import { retryRequest } from "app/utils/general";
import { completeCoinsPurchase } from "app/apis/coins";
import { useAppSelector } from "app/redux/store";
import { useToast } from "app/hooks";
import { getProductInfo } from "app/utils/purchases";
import { Text } from "../Text";
import { Dimensions, TextStyle, View, ViewStyle } from "react-native";
import { Button } from "../Button";
import { colors, spacing } from "app/theme";
import { ReanimatedModal } from "./ReanimatedModal";

type Props = { onCompleted?: () => void };

export type CoinsPurchaseCompleteModalRef = {
  completePurchase: (productId: string) => void;
};

export const CoinsPurchaseCompleteModal = forwardRef<
  CoinsPurchaseCompleteModalRef,
  Props
>(function CoinsPurchaseCompleteModal({ onCompleted }, ref) {
  const Toast = useToast();

  const modal = useRef<ModalRef>(null);

  const [completingPurchase, setCompletingPurchase] = useState<string>();
  const [success, setSuccess] = useState(false);

  const productInfo = completingPurchase
    ? getProductInfo(completingPurchase)
    : undefined;

  const activeUser = useAppSelector((state) => state.user.user as User);

  const completePurchase = async (productId: string) => {
    setCompletingPurchase(productId);

    modal.current?.open();

    try {
      await retryRequest(() => completeCoinsPurchase(activeUser.id, productId));
      setSuccess(true);
    } catch (error) {
      Toast.show("Could not complete your purchase. Please try again.");
      modal.current?.close();
    }
  };

  useImperativeHandle(ref, () => ({ completePurchase }));

  const handleDismiss = useCallback(() => {
    setCompletingPurchase(undefined);
    setSuccess(false);
  }, []);

  return (
    <ReanimatedModal ref={modal} tapToDismiss={false} onDismiss={handleDismiss}>
      <AnimatedLottieView
        source={require("../../../assets/lottie/coins-lottie.json")}
        style={$lottie}
        autoPlay
      />
      {!!completingPurchase && productInfo && (
        <View style={$bottomContent}>
          <Text preset="subheading" style={$text}>
            {success ? "Purchase Complete" : "Completing Purchase"}
          </Text>
          <Text style={$text}>
            {success ? "Added" : "Adding"} {productInfo.coins} coins to your
            account.
          </Text>
          {success && (
            <Button
              preset="filled"
              text="Continue"
              style={$continueButton}
              onPress={() => {
                modal.current?.close();
                typeof onCompleted === "function" && onCompleted();
              }}
              pressedStyle={$continueButtonPressed}
            />
          )}
        </View>
      )}
    </ReanimatedModal>
  );
});

const LOTTIE_SIZE = Math.min(250, Dimensions.get("window").width * 0.7);

const $lottie: ViewStyle = {
  height: LOTTIE_SIZE,
  width: LOTTIE_SIZE,
  alignSelf: "center",
};

const $continueButton: ViewStyle = {
  backgroundColor: colors.success,
  marginTop: spacing.md,
};

const $continueButtonPressed: ViewStyle = {
  backgroundColor: colors.success,
};

const $text: TextStyle = {
  textAlign: "center",
};

const $bottomContent: ViewStyle = {
  padding: spacing.md,
  paddingTop: 0,
};
