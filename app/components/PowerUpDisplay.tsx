import React from "react";
import { colors, spacing } from "app/theme";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";
import { $row } from "./styles";
import { PowerUp, PowerUps } from "delivfree";
import { getPowerUpInfo } from "app/utils/powerUps";
import { AnimatedNumber } from "./AnimatedNumber";

export type Props = {
  style?: ViewStyle;
  onPress?: () => void;
  onPowerUpPress?: (powerUp: PowerUp) => void;
  powerUps: { [Property in PowerUp]: { quantity: number } };
};

export const PowerUpDisplay = ({
  style,
  onPress,
  onPowerUpPress,
  powerUps,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[$container, style]}
      disabled={!onPress}
    >
      {Object.values(PowerUps).map((powerUp) => {
        const powerUpInfo = getPowerUpInfo(powerUp);
        if (!powerUpInfo) {
          return null;
        }
        return (
          <Pressable
            style={$row}
            key={powerUp}
            disabled={!onPowerUpPress}
            onPress={() => onPowerUpPress && onPowerUpPress(powerUp)}
          >
            <powerUpInfo.Icon style={$image} height={33} width={33} />
            <View style={$numberBubble}>
              <AnimatedNumber
                value={powerUps[powerUp].quantity}
                textProps={{
                  size: "xxs",
                  weight: "semiBold",
                  style: $bubbleText,
                }}
              />
            </View>
          </Pressable>
        );
      })}
    </Pressable>
  );
};

const $container: ViewStyle = {
  borderRadius: 4,
  backgroundColor: colors.surface,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: spacing.sm,
};

const $image: ViewStyle = { marginRight: spacing.xs };

const $numberBubble: ViewStyle = {
  borderRadius: 100,
  minHeight: 25,
  minWidth: 25,
  backgroundColor: colors.text,
  alignItems: "center",
  justifyContent: "center",
};

const $bubbleText: TextStyle = { color: "#fff" };
