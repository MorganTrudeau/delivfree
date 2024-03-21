import React, { useEffect, useState } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const defaultStyle = {};

export const Placeholder = ({
  children,
  style = defaultStyle,
  loaded,
  LoadingComponent,
}: {
  children: React.ReactNode | React.ReactNode[];
  style?: ViewStyle;
  loaded: boolean;
  LoadingComponent: React.ReactElement;
}) => {
  const fade = useSharedValue(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      setReady(true);
      fade.value = withDelay(60, withTiming(1));
    }
  }, [loaded]);

  const fadeStyle = useAnimatedStyle(
    () => ({ ...style, opacity: fade.value }),
    []
  );

  if (!ready) {
    return LoadingComponent;
  }

  return <Animated.View style={fadeStyle}>{children}</Animated.View>;
};
