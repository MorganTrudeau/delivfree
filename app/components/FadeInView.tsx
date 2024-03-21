import React, { useEffect, useState } from "react";
import { InteractionManager, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const defaultStyle = {};

export const FadeInView = ({
  children,
  style = defaultStyle,
}: {
  children: React.ReactNode | React.ReactNode[];
  style?: ViewStyle;
}) => {
  const fade = useSharedValue(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const promise = InteractionManager.runAfterInteractions(() => {
      setReady(true);
      fade.value = withDelay(60, withTiming(1));
    });
    return () => promise.cancel();
  }, []);

  const fadeStyle = useAnimatedStyle(
    () => ({ ...style, opacity: fade.value }),
    []
  );

  if (!ready) {
    return null;
  }

  return <Animated.View style={fadeStyle}>{children}</Animated.View>;
};
