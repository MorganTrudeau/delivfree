import React, { useMemo } from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { $card, MAX_CONTAINER_WIDTH } from "./styles";
import { useDimensions } from "app/hooks/useDimensions";

export const Card = ({
  largeStyle,
  smallStyle,
  ...rest
}: ViewProps & { largeStyle?: ViewStyle; smallStyle?: ViewStyle }) => {
  const { width } = useDimensions();
  const largeLayout = width > MAX_CONTAINER_WIDTH;
  const style: StyleProp<ViewStyle> = useMemo(
    () => [
      largeLayout
        ? { ...$card, ...largeStyle }
        : { width: "100%", ...smallStyle },
      rest.style,
    ],
    [rest.style, largeLayout]
  );
  return <View {...rest} style={style} />;
};
