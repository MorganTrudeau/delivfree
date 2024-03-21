import React, { useEffect, useRef, useState } from "react";
import { Text, TextProps } from "./Text";
import { Animated, TextStyle, View, ViewStyle } from "react-native";
import { colors } from "app/theme";

const defaultTextProps = {};

export const AnimatedNumber = ({
  style,
  textProps = defaultTextProps,
  value,
}: {
  style?: ViewStyle;
  textProps?: TextProps;
  value: number | undefined;
}) => {
  const [nextValueState, setNextValueState] = useState<{
    value: number | undefined;
    positive: boolean;
  }>({
    value: undefined,
    positive: true,
  });
  const [currentValue, setCurrentValue] = useState(value);

  const currentRatingAnimation = useRef(new Animated.Value(1)).current;
  const nextRatingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value && value !== currentValue) {
      setNextValueState({ value, positive: value >= (currentValue || 0) });

      Animated.parallel([
        Animated.timing(currentRatingAnimation, {
          toValue: 0,
          useNativeDriver: true,
          duration: 150,
        }),
        Animated.timing(nextRatingAnimation, {
          toValue: 1,
          useNativeDriver: true,
          duration: 150,
        }),
      ]).start(() => {
        setCurrentValue(value);
      });

      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(currentRatingAnimation, {
            toValue: 1,
            useNativeDriver: true,
            duration: 400,
          }),
          Animated.timing(nextRatingAnimation, {
            toValue: 0,
            useNativeDriver: true,
            duration: 400,
          }),
        ]),
      ]).start(() => {
        setNextValueState({ value: undefined, positive: true });
      });
    }
  }, [value]);

  return (
    <View style={style}>
      <Animated.View style={{ opacity: currentRatingAnimation }}>
        <Text weight={"semiBold"} {...textProps}>
          {currentValue}
        </Text>
      </Animated.View>

      {!!nextValueState.value && (
        <Animated.View style={[$nextRating, { opacity: nextRatingAnimation }]}>
          <Text
            weight={"semiBold"}
            {...textProps}
            style={nextValueState.positive ? $positiveRating : $negativeRating}
          >
            {nextValueState.value}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const $nextRating: TextStyle = {
  position: "absolute",
};
const $positiveRating: TextStyle = {
  color: colors.success,
};
const $negativeRating: TextStyle = {
  color: colors.error,
};
