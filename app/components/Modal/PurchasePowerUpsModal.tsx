import React, { forwardRef, useContext, useRef, useState } from "react";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";

import { Pressable, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { useDebounce, useToast } from "app/hooks";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalRef, PowerUp, PowerUps, User } from "smarticus";
import { getPowerUpInfo } from "app/utils/powerUps";
import { sizing } from "app/theme/sizing";
import { purchasePowerUp } from "app/apis/powerUps";
import { useAppSelector } from "app/redux/store";
import { QuantitySelector } from "../QuantitySelector";
import { Button } from "../Button";
import { Coins } from "../Coins";
import { $row, HORIZONTAL_SAFE_AREA_EDGES } from "../styles";
import { translate } from "app/i18n";
import { CoinsContext } from "app/context/CoinsContext";
import { useCombinedRefs } from "app/hooks/useCombinedRefs";
import { PurchaseCoins } from "../PurchaseCoins";
import { logAnalytics } from "app/services/firebase/analytics";
import { ImageStyle } from "react-native-fast-image";
import { ReanimatedModal } from "./ReanimatedModal";
import { UserPowerUpDisplay } from "../UserPowerUpsDisplay";
import { SafeAreaView } from "../SafeAreaView";

type Props = { closeOnPurchase?: boolean };

const ForwardRefPurchasePowerUpsModal = forwardRef<BottomSheetRef, Props>(
  function PurchaseCoinsModal({ closeOnPurchase }, ref) {
    const insets = useSafeAreaInsets();

    const innerRef = useRef<BottomSheetRef>(null);

    const combinedRefs = useCombinedRefs(innerRef, ref);

    const close = () => {
      console.log("CLOSE", innerRef.current);
      innerRef.current?.close();
    };

    return (
      <BottomSheet ref={combinedRefs}>
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing.md,
          }}
        >
          <PurchasePowerUps
            closeOnPurchase={closeOnPurchase}
            onRequestClose={close}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

export const PurchasePowerUpsModal = React.memo(
  ForwardRefPurchasePowerUpsModal
);

const powerUps = Object.values(PowerUps);

const PurchasePowerUps = ({
  closeOnPurchase,
  onRequestClose,
}: {
  closeOnPurchase?: boolean;
  onRequestClose: () => void;
}) => {
  const toastContext = useToast();
  const coinsContext = useContext(CoinsContext);

  const activeUser = useAppSelector((state) => state.user.user as User);

  const handlePurchasePowerUp = async (powerUp: PowerUp, quantity: number) => {
    try {
      await purchasePowerUp(activeUser.id, powerUp, quantity);

      logAnalytics("purchase_powerup");

      if (closeOnPurchase) {
        onRequestClose();
      }
    } catch (error) {
      console.log("Failed to purchase power up: ", error);
      toastContext.show(translate("errors.common"));
    }
  };

  const startPurchasePowerUp = (powerUp: PowerUp, quantity: number) => {
    const powerUpInfo = getPowerUpInfo(powerUp);
    const coinsNeeded = powerUpInfo.coins * quantity;
    coinsContext.canBuy(coinsNeeded, () =>
      handlePurchasePowerUp(powerUp, quantity)
    );
  };

  return (
    <SafeAreaView style={$content} edges={HORIZONTAL_SAFE_AREA_EDGES}>
      <View style={$heading}>
        <Text preset="heading">Power-Ups</Text>
        <PurchaseCoins />
      </View>

      <Text style={$message}>
        Improve your game with power-ups to help with difficult questions and
        boost your rating.
      </Text>

      <UserPowerUpDisplay style={$powerUpDisplay} />

      {powerUps.map((powerUp, index) => {
        const lastItem = index === powerUps.length - 1;
        return (
          <PowerUpPurchaseItem
            key={powerUp}
            powerUp={powerUp}
            onPurchase={startPurchasePowerUp}
            style={lastItem ? undefined : $purchaseItemMargin}
          />
        );
      })}

      {/* <PowerUpPurchaseCompleteModal ref={powerUpPurchaseComplete} /> */}
    </SafeAreaView>
  );
};

const PowerUpPurchaseItem = ({
  powerUp,
  onPurchase,
  style,
}: {
  powerUp: PowerUp;
  onPurchase: (powerUp: PowerUp, quantity: number) => void;
  style?: ViewStyle;
}) => {
  const quatityModal = useRef<ModalRef>(null);

  const powerUpInfo = getPowerUpInfo(powerUp);

  const onPress = () => {
    quatityModal.current?.open();
  };

  if (!powerUpInfo) {
    return null;
  }

  return (
    <>
      <Pressable style={[$purchaseItem, style]} onPress={onPress}>
        <powerUpInfo.Icon style={$powerUp} height={50} width={50} />
        <View style={$purchaseText}>
          <Text preset="heading" size={"lg"}>
            {powerUpInfo.title}
          </Text>
          <Text size={"xs"}>{powerUpInfo.description}</Text>
        </View>
        <Coins
          coins={powerUpInfo.coins}
          style={$coinsContainer}
          imageStyle={$coin}
          textProps={{ size: "lg" }}
        />
      </Pressable>
      <ReanimatedModal ref={quatityModal} containerStyle={$modalContainer}>
        <PowerUpQuantitySelector
          powerUp={powerUp}
          onConfirm={(quantity) => {
            quatityModal.current?.close();
            onPurchase(powerUp, quantity);
          }}
        />
      </ReanimatedModal>
    </>
  );
};

const PowerUpQuantitySelector = ({
  powerUp,
  onConfirm,
}: {
  powerUp: PowerUp;
  onConfirm: (quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);

  const powerUpInfo = getPowerUpInfo(powerUp);

  const debounce = useDebounce(1000);

  if (!powerUpInfo) {
    return null;
  }

  return (
    <View style={$quantityModalContent}>
      <View style={$quantityModalHeader}>
        <Text preset="heading" size="xl">
          {powerUpInfo.title}
        </Text>
        <Text preset="formHelper" size="xs">
          Choose quantity
        </Text>
      </View>
      <View style={$quantityTopContent}>
        <powerUpInfo.Icon style={$quantityPowerUp} height={45} width={45} />

        <QuantitySelector quantity={quantity} onChange={setQuantity} />
      </View>
      <View style={$quantityModalInner}>
        <View style={$row}>
          <Text>Coins</Text>
          <Coins coins={powerUpInfo.coins * quantity} style={$quantityCoins} />
        </View>
      </View>
      <Button
        text="Add Power-ups"
        preset="reversed"
        style={$buyPowerUpButton}
        onPress={debounce(() => onConfirm(quantity))}
      />
    </View>
  );
};

const $quantityModalContent: ViewStyle = {
  padding: spacing.lg,
};

const $quantityTopContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: spacing.md,
};

const $quantityModalHeader: ViewStyle = {
  alignItems: "center",
  paddingBottom: spacing.md,
};

const $modalContainer: ViewStyle = {
  width: undefined,
};

const $quantityModalInner: ViewStyle = {
  alignItems: "center",
};

const $quantityCoins: ViewStyle = {
  marginStart: spacing.xs,
};

const $buyPowerUpButton: ViewStyle = {
  marginTop: spacing.lg,
};

const $coinsContainer: ViewStyle = {
  paddingVertical: 0,
};

const $coin: ImageStyle = {
  height: sizing.lg,
  width: sizing.lg,
};

const $heading: TextStyle = {
  marginBottom: spacing.xs,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};

const $message: TextStyle = { marginBottom: spacing.sm };

const $powerUp: ViewStyle = { marginRight: spacing.md };
const $quantityPowerUp: ViewStyle = {
  marginRight: spacing.md,
};

const $purchaseText: ViewStyle = {
  flex: 1,
  paddingEnd: spacing.xs,
};

const $purchaseItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.sm,
  paddingBottom: spacing.md,
  paddingHorizontal: spacing.md,
  borderRadius: 10,
  backgroundColor: colors.surface,
};

const $purchaseItemMargin: ViewStyle = {
  marginBottom: spacing.md,
};

const $content: ViewStyle = {
  padding: spacing.md,
};

const $powerUpDisplay: ViewStyle = {
  backgroundColor: colors.background,
  marginBottom: spacing.md,
};
