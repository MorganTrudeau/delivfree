import { useHeaderHeight } from "app/hooks";
import React, { useMemo } from "react";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { AppLogo } from "./AppLogo";

const imageRatio = 2320 / 316;

interface Props extends Object {
  style?: ImageStyle;
}

export const LogoHeader = ({ style }: Props) => {
  const headerHeight = useHeaderHeight();

  const _style = useMemo(() => {
    const height = headerHeight * 0.4;
    const width = height * imageRatio;
    return [{ height, width }, style];
  }, [headerHeight, style]);

  return <AppLogo style={_style} height={headerHeight} />;
};
