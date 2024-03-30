import React, { useMemo } from "react";
import { View, ViewProps, useWindowDimensions } from "react-native";
import { $card, MAX_CONTAINER_WIDTH } from "./styles";

export const Card = (props: ViewProps) => {
  const { width } = useWindowDimensions();
  const style = useMemo(
    () => [width > MAX_CONTAINER_WIDTH ? $card : undefined, props.style],
    [props.style]
  );
  return <View {...props} style={style} />;
};
