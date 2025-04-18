import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleProp,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

const isWeb = Platform.OS === "web";

export type Props = {
  backgroundColor?: string;
  width?: number | `${number}%`;
  height?: number;
  style?: StyleProp<ViewStyle>;
  loadingStyle?: StyleProp<ViewStyle>;
  loading: boolean;
  children?: ViewProps["children"];
  disableAutoHeight?: boolean;
};

export const LoadingPlaceholder = ({
  backgroundColor = "rgba(0,0,0,0.1)",
  width,
  height = 20,
  style,
  loadingStyle,
  loading,
  children,
  disableAutoHeight,
}: Props) => {
  const opacity = useRef(new Animated.Value(1)).current;

  const animation = useRef<Animated.CompositeAnimation>();

  useEffect(() => {
    if (loading) {
      animation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
            useNativeDriver: !isWeb,
            duration: 1000,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            useNativeDriver: !isWeb,
            duration: 1000,
          }),
        ])
      );
      animation.current.start();
    }

    return () => {
      animation.current && animation.current.stop();
    };
  }, [loading, opacity]);

  if (!loading) {
    return <View style={style}>{children}</View>;
  }

  return (
    <Animated.View
      style={[
        loadingStyle,
        style,
        { backgroundColor, width, borderRadius: 5 },
        !disableAutoHeight && { height },
        { opacity },
      ]}
    />
  );
};
