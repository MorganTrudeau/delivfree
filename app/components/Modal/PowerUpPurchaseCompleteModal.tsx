import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ReanimatedModal } from "./ReanimatedModal";
import { ModalRef, PowerUp } from "smarticus";
import { getPowerUpInfo } from "app/utils/powerUps";
import { TextStyle, View, ViewStyle } from "react-native";
import { $row } from "../styles";
import { AnimatedNumber } from "../AnimatedNumber";
import { colors, spacing } from "app/theme";

export type PowerUpPurchaseCompleteRef = {
  complete: (
    powerUp: PowerUp,
    startQuantity: number,
    purchasedQuantity: number
  ) => void;
};

export const PowerUpPurchaseCompleteModal =
  forwardRef<PowerUpPurchaseCompleteRef>(function PowerUpPurchaseCompleteModal(
    props,
    ref
  ) {
    const modal = useRef<ModalRef>(null);

    // const powerUps = useAppSelector((state) => state.powerUps.powerUps);

    const [powerUp, setPowerUp] = useState<PowerUp>();
    const [quantity, setQuantity] = useState(0);

    const powerUpInfo = powerUp ? getPowerUpInfo(powerUp) : null;

    const complete = (
      powerUp: PowerUp,
      startQuantity: number,
      purchasedQuantity: number
    ) => {
      setPowerUp(powerUp);
      setQuantity(startQuantity);
      modal.current?.open();
      setTimeout(() => {
        setQuantity(startQuantity + purchasedQuantity);
      }, 200);
    };

    useImperativeHandle(ref, () => ({ complete }));

    return (
      <ReanimatedModal
        ref={modal}
        containerStyle={$modalContainer}
        contentStyle={$modalContent}
      >
        <View style={$row}>
          {powerUpInfo ? (
            <powerUpInfo.Icon height={ICON_SIZE} width={ICON_SIZE} />
          ) : null}
          <AnimatedNumber
            value={quantity}
            style={$number}
            textProps={{ style: $textStyle }}
          />
        </View>
      </ReanimatedModal>
    );
  });

const ICON_SIZE = 50;
const NUMBER_BUBBLE_SIZE = 30;

const $modalContainer: ViewStyle = {
  width: undefined,
};

const $modalContent: ViewStyle = {
  padding: spacing.lg,
};

const $number: ViewStyle = {
  height: NUMBER_BUBBLE_SIZE,
  width: NUMBER_BUBBLE_SIZE,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: NUMBER_BUBBLE_SIZE / 2,
  backgroundColor: colors.text,
};

const $textStyle: TextStyle = {
  color: "#fff",
};
