import { useDrawer, useHeaderHeight } from "app/hooks";
import React, { useMemo } from "react";
import { ImageStyle } from "react-native-fast-image";
import { AppLogo } from "./AppLogo";
import { Pressable } from "react-native";

const imageRatio = 2320 / 316;

interface Props extends Object {
  style?: ImageStyle;
  onPress?: () => void;
}

export const LogoHeader = ({ style, onPress }: Props) => {
  const headerHeight = useHeaderHeight();
  const { alwaysOpen } = useDrawer();

  const _style = useMemo(() => {
    const height = headerHeight * 0.4;
    const width = height * imageRatio;
    return { height, width };
  }, [headerHeight]);

  if (alwaysOpen) {
    return null;
  }

  return (
    <Pressable onPress={onPress} style={style}>
      <AppLogo style={_style} height={headerHeight} />
    </Pressable>
  );
};
