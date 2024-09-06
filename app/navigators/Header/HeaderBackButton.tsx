import React from "react";
import { ViewStyle, StyleProp, Pressable } from "react-native";
import HeaderBackIcon from "./HeaderBackIcon";
import { spacing } from "app/theme";

type Props = {
  headerColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const HeaderBackButton = ({ headerColor, onPress, style }: Props) => {
  return (
    <Pressable hitSlop={10} onPress={onPress} style={$style}>
      <HeaderBackIcon color={headerColor} style={style} />
    </Pressable>
  );
};

const $style: ViewStyle = { alignItems: "flex-start", marginLeft: -spacing.sm };

export default HeaderBackButton;
