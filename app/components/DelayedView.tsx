import React, { useEffect, useRef } from "react";
import { StyleProp, ViewStyle, Animated, ViewProps } from "react-native";

type Props = {
  children: React.ReactElement;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
} & Partial<ViewProps>;

const DelayedView = ({
  children,
  delay = 200,
  duration = 500,
  style,
  ...rest
}: Props) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(
      () =>
        Animated.timing(animation, {
          toValue: 1,
          useNativeDriver: true,
          duration,
        }).start(),
      delay
    );
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Animated.View {...rest} style={[style, { opacity: animation }]}>
      {children}
    </Animated.View>
  );
};

export default DelayedView;
