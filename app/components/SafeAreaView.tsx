import React, { useMemo } from "react";
import { View, ViewProps } from "react-native";
import { Edge, useSafeAreaInsets } from "react-native-safe-area-context";

type SafeAreaViewProps = {
  edges?: Edge[];
} & ViewProps;

export const SafeAreaView = ({ edges, style, ...rest }: SafeAreaViewProps) => {
  const insets = useSafeAreaInsets();

  const safeAreaStyle = useMemo(() => {
    if (!edges) {
      return style;
    }
    const edgePadding = edges.reduce((acc, edge) => {
      if (edge === "bottom") {
        return { ...acc, bottom: insets.bottom };
      } else if (edge === "top") {
        return { ...acc, top: insets.top };
      } else if (edge === "left") {
        return { ...acc, left: insets.left };
      } else if (edge === "right") {
        return { ...acc, right: insets.right };
      }
      return acc;
    }, {});

    return [style, edgePadding];
  }, [style, edges, insets]);

  return <View style={safeAreaStyle} {...rest} />;
};
