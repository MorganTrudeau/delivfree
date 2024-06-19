import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, View, ViewProps, ViewStyle } from "react-native";

export type Props = {
  backgroundColor?: string;
  width?: number | `${number}%`;
  height?: number;
  style?: StyleProp<ViewStyle>;
  loadingStyle?: StyleProp<ViewStyle>;
  loading: boolean;
  children?: ViewProps["children"];
};

export const LoadingPlaceholder = ({
  backgroundColor = "rgba(0,0,0,0.1)",
  width,
  height = 20,
  style,
  loadingStyle,
  loading,
  children,
}: Props) => {
  const opacity = useRef(new Animated.Value(1)).current;

  const animation = useRef<Animated.CompositeAnimation>();

  useEffect(() => {
    if (loading) {
      animation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
            useNativeDriver: true,
            duration: 1000,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            useNativeDriver: true,
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
        style,
        loadingStyle,
        { backgroundColor, width, height, borderRadius: 5 },
        { opacity },
      ]}
    />
  );
};
