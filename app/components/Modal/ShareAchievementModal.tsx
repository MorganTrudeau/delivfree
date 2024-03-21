import { BadgeId, ModalRef } from "smarticus";
import React, { forwardRef, useEffect } from "react";
import { ReanimatedModal } from "./ReanimatedModal";
import { badges } from "app/utils/badges";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { $borderedArea, $row } from "../styles";
import { PixelRatio, TextStyle, View, ViewStyle } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { colors, spacing } from "app/theme";
import Clipboard from "@react-native-community/clipboard";

export const ShareAchievement = ({ badgeId }: { badgeId: BadgeId }) => {
  const badgeData = badges[badgeId];

  useEffect(() => {
    const message = `${badgeData.shareMessage}\n\nhttps://smarticus.onelink.me/0hhT/playtrivia`;
    Clipboard.setString(message);
  }, []);

  return (
    <>
      <Text>{badgeData.shareMessage}</Text>
      <FastImage
        source={require("../../../assets/images/share-banner.png")}
        style={$image}
        resizeMode="contain"
      />

      <View style={$borderedArea}>
        <Text preset="subheading">Achievement Copied</Text>
        <Text>Paste into your social media of choice</Text>
        <View style={$row}>
          <Icon icon="facebook" style={$icon} />
          <Icon icon="twitter" style={$icon} />
          <Icon icon="whatsapp" style={$icon} />
          <Text style={$icon}>And more...</Text>
        </View>
      </View>
    </>
  );
};

export const ShareAchievementModal = forwardRef<
  ModalRef,
  {
    badgeId?: BadgeId;
  }
>(function ShareAchievementModal({ badgeId }, ref) {
  return (
    <ReanimatedModal ref={ref} contentStyle={$content} showCloseButton>
      {!!badgeId && <ShareAchievement badgeId={badgeId} />}
    </ReanimatedModal>
  );
});

const $content: ViewStyle = {
  paddingTop: spacing.xl,
  padding: spacing.md,
};

const $icon: TextStyle = {
  marginRight: spacing.sm,
  marginTop: spacing.xs,
  color: colors.primary,
};

const $image: ImageStyle = {
  height: PixelRatio.roundToNearestPixel(500 / 3),
  maxWidth: PixelRatio.roundToNearestPixel(1024 / 3),
  marginTop: spacing.sm,
  marginBottom: spacing.md,
};
