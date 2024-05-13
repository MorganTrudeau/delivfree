import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Animated, ViewProps } from "react-native";

export type FadeViewRef = { fadeOut: () => void; fadeIn: () => void };

const FadeView = (
  {
    onFadeOut,
    fadeInDuration = 300,
    fadeOutDuration = 200,
    style,
    ...props
  }: ViewProps & {
    onFadeOut?: () => void;
    fadeInDuration?: number;
    fadeOutDuration?: number;
  },
  ref: ForwardedRef<FadeViewRef>
) => {
  const animationState = useRef<"in" | "out">();

  const fadeAnimationValue = useRef(new Animated.Value(0)).current;

  const fadeInAnimation = useRef<Animated.CompositeAnimation>();
  const fadeOutAnimation = useRef<Animated.CompositeAnimation>();

  const fadeIn = () => {
    if (animationState.current === "in") {
      return;
    }
    animationState.current = "in";
    if (fadeOutAnimation.current) {
      fadeOutAnimation.current.stop();
      fadeOutAnimation.current = undefined;
    }
    fadeInAnimation.current = Animated.timing(fadeAnimationValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: fadeInDuration,
    });
    fadeInAnimation.current.start();
  };

  const fadeOut = () => {
    if (animationState.current === "out") {
      return;
    }
    animationState.current = "out";
    if (fadeInAnimation.current) {
      fadeInAnimation.current.stop();
      fadeInAnimation.current = undefined;
    }
    fadeOutAnimation.current = Animated.timing(fadeAnimationValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: fadeOutDuration,
    });
    fadeOutAnimation.current.start(() => {
      if (onFadeOut) {
        onFadeOut();
      }
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  useImperativeHandle(ref, () => ({ fadeOut, fadeIn }));

  return (
    <Animated.View
      {...props}
      style={[{ opacity: fadeAnimationValue }, style]}
    />
  );
};

const ForwardRefFadeView = forwardRef(FadeView);

export default ForwardRefFadeView;
