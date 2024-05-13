import { useAdBanner } from "app/hooks/useAdBanner";
import { borderRadius } from "app/theme/borderRadius";
import { Cuisine } from "delivfree";
import React, { useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";

interface Props {
  type: "general" | "checkout" | Cuisine;
  style?: ViewStyle;
}

export const AdBanner = ({ type, style }: Props) => {
  const ads = useAdBanner();

  const ad = ads[type]?.image ? ads[type] : ads.general;
  const hasText = !!ad?.title || !!ad?.text;

  const imageStyle: ImageStyle = useMemo(() => {
    if (hasText) {
      return {
        width: "100%",
        maxWidth: 500,
        aspectRatio: 4,
        borderTopRightRadius: borderRadius.md,
        borderTopLeftRadius: borderRadius.md,
      };
    }
    return {
      width: "100%",
      maxWidth: 500,
      aspectRatio: 4,
      borderRadius: borderRadius.md,
    };
  }, [style, hasText]);

  if (!ad) {
    return null;
  }

  return (
    <View style={style}>
      <FastImage source={{ uri: ad.image }} style={imageStyle} />
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
  borderColor: colors.border,
};
