import React, { forwardRef } from "react";
import AnimatedLottieView from "lottie-react-native";
import { ModalRef } from "smarticus";
import { Text } from "../Text";
import { Dimensions, TextStyle, View, ViewStyle } from "react-native";
import { Button } from "../Button";
import { colors, spacing } from "app/theme";
import { ReanimatedModal } from "./ReanimatedModal";

type Props = { onBuyCoins: () => void };

export const NotEnoughCoinsModal = forwardRef<ModalRef, Props>(
  function CoinsPurchaseCompleteModal({ onBuyCoins }, ref) {
    return (
      <ReanimatedModal ref={ref}>
        <AnimatedLottieView
          source={require("../../../assets/lottie/coins-lottie.json")}
          style={$lottie}
          autoPlay
        />
        <View style={$bottomContent}>
          <Text preset="subheading" style={$text}>
            Not enough coins
          </Text>
          <Text style={$text}>Buy more coins to continue.</Text>
          <Button
            preset="filled"
            text="Buy Coins"
            style={$continueButton}
            onPress={onBuyCoins}
            pressedStyle={$continueButtonPressed}
          />
        </View>
      </ReanimatedModal>
    );
  }
);

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
