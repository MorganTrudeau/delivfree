import { Icon } from "app/components";
import { spacing } from "app/theme";
import React from "react";
import {
  Platform,
  StyleSheet,
  I18nManager,
  ViewStyle,
  StyleProp,
} from "react-native";

const defaultSize = Platform.select({ android: 24, default: 31 });
const defaultColor = "#fff";
// const svgId = Platform.select({
//   default: SvgIds.androidBack,
//   ios: SvgIds.iosBack,
// });

type Props = { color?: string; style?: StyleProp<ViewStyle>; size?: number };

const HeaderBackIcon = ({
  color = defaultColor,
  style,
  size = defaultSize,
}: Props) => {
  return (
    <Icon
      icon={"back"}
      color={color}
      size={size}
      containerStyle={[styles.icon, style]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: "contain",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

export default HeaderBackIcon;
