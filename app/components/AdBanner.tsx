import { useAdBanner } from "app/hooks/useAdBanner";
import { borderRadius } from "app/theme/borderRadius";
import { Cuisine } from "delivfree";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";
import { $adNoText, $adWithText } from "./styles";

interface Props {
  type: "general" | "checkout" | Cuisine;
  style?: ViewStyle;
}

export const AdBanner = ({ type, style }: Props) => {
  const ads = useAdBanner();

  const ad = ads[type]?.image ? ads[type] : ads.general;
  const hasText = !!ad?.title || !!ad?.text;

  if (!ad) {
    return null;
  }

  return (
    <View style={style}>
      <FastImage
        source={{ uri: ad.image }}
        style={hasText ? $adWithText : $adNoText}
      />
      {(!!ad.title || !!ad.text) && (
        <View style={$textWrapper}>
          {!!ad.title && (
            <Text preset="subheading" size={"xs"}>
              {ad.title}
            </Text>
          )}
          {!!ad.text && <Text size={"xxs"}>{ad.text}</Text>}
        </View>
      )}
    </View>
  );
};

const $textWrapper: ViewStyle = {
  padding: spacing.sm,
  paddingVertical: spacing.xs,
  backgroundColor: colors.surface,
  borderBottomRightRadius: borderRadius.md,
  borderBottomLeftRadius: borderRadius.md,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.borderLight,
  maxWidth: 500,
};
