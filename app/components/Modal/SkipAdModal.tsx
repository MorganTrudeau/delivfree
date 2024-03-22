import React, { forwardRef, useContext, useRef } from "react";
import { ModalRef } from "delivfree";
import { TextStyle, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { Button } from "../Button";
import { Coins } from "../Coins";
import { colors, spacing } from "app/theme";
import { useAppSelector } from "app/redux/store";
import { reduceCoins } from "app/apis/coins";
import { useCombinedRefs } from "app/hooks/useCombinedRefs";
import { CoinsContext } from "app/context/CoinsContext";
import { Icon } from "../Icon";
import { $row } from "../styles";
import { ReanimatedModal } from "./ReanimatedModal";
import { logAnalytics } from "app/services/firebase/analytics";

type Props = {
  onSkip: () => void;
  onContinue: () => void;
};

export const SkipAdModal = forwardRef<ModalRef, Props>(function SkipAdModal(
  { onSkip, onContinue },
  ref
) {
  const coinsContext = useContext(CoinsContext);

  const innerRef = useRef<ModalRef>(null);
  const combinedRefs = useCombinedRefs(innerRef, ref);

  const config = useAppSelector((state) => state.appConfig.config);
  const activeUserId = useAppSelector((state) => state.user.user?.id);

  const handleContinue = () => {
    innerRef.current?.close();
    logAnalytics(`ad_view_continue`);
    onContinue();
  };

  const handleSkipAd = async () => {
    try {
      innerRef.current?.close();
      logAnalytics(`ad_view_skip`);
      onSkip();
      if (activeUserId) {
        await reduceCoins(activeUserId, config.skipAdCoins);
      }
    } catch (error) {
      console.log("Failed to reduce coins for skipping ad: ", error);
    }
  };

  const prepareSkipAd = async () => {
    coinsContext.canBuy(config.skipAdCoins, handleSkipAd);
  };

  return (
    <ReanimatedModal ref={combinedRefs}>
      <View style={$content}>
        <View style={$row}>
          <Icon icon="play-box" style={$icon} />
          <Text preset="subheading">Ad Break</Text>
        </View>
        <Text>Watch a quick ad before playing.</Text>
        <Button
          preset="filled"
          LeftAccessory={() => <Coins coins={1} style={$coinsHidden} />}
          RightAccessory={() => (
            <Coins coins={config.skipAdCoins} style={$coins} />
          )}
          text="Skip Ad"
          style={$skipAdButton}
          onPress={prepareSkipAd}
        />
        <Button text="Continue" onPress={handleContinue} />
      </View>
    </ReanimatedModal>
  );
});

const $icon: TextStyle = {
  marginEnd: spacing.xxs,
};

const $content: ViewStyle = { padding: spacing.md };

const $skipAdButton: ViewStyle = {
  marginTop: spacing.md,
  marginBottom: spacing.sm,
};

const $coins: ViewStyle = {
  backgroundColor: colors.palette.neutral300,
  borderWidth: 2,
  borderColor: colors.palette.primary400,
  marginStart: spacing.xs,
};

const $coinsHidden: ViewStyle = {
  opacity: 0,
  marginEnd: spacing.xs,
};
