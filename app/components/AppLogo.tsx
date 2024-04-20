import { useHeaderHeight } from "app/hooks";
import React, { useMemo } from "react";
import { StyleProp } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";

const imageRatio = 2320 / 316;

interface Props {
  style?: StyleProp<ImageStyle>;
  height: number;
}

export const AppLogo = ({ style, height }: Props) => {
  const _style = useMemo(() => {
    const _height = height * 0.45;
    const width = _height * imageRatio;
    return [{ height: _height, width }, style];
  }, [height, style]);

  return (
    <FastImage
      source={require("../../assets/images/app-logo-inline.png")}
      style={_style}
    />
  );
};
