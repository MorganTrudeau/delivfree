import React from "react";
import {
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { shadeColor } from "../utils/general";
import { colors, spacing } from "app/theme";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type GradientViewProps = {
  isBottom?: boolean;
  horizontal?: boolean | null;
  style: Animated.AnimateStyle<ViewStyle>;
  color: string;
};

const GradientView = ({
  isBottom,
  horizontal,
  style,
  color,
}: GradientViewProps) => {
  const transparent = shadeColor(color, 0);
  const colors = isBottom ? [transparent, color] : [color, transparent];
  return (
    <Animated.View // Need to contain with view AnimatedLinearGradient doesn't work on web
      style={[
        $gradient,
        {
          [horizontal ? "width" : "height"]: spacing.lg,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        {...(horizontal ? { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } } : {})}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
};

export type Props = {
  children: React.ReactNode | React.ReactNode[];
  scrollViewProps?: ScrollViewProps;
  containerStyle?: StyleProp<ViewStyle>;
  color?: string;
  innerRef?: React.RefObject<Animated.ScrollView>;
};

const defaultScrollViewProps = {};

export const GradientScrollView = ({
  children,
  scrollViewProps = defaultScrollViewProps,
  containerStyle,
  color = colors.background,
  innerRef,
}: Props) => {
  // Animated Values
  const offset = useSharedValue(0);
  const totalSize = useSharedValue(0);
  const layoutSize = useSharedValue(0);

  // Helpers
  const horizontal = !!scrollViewProps?.horizontal;

  // Events
  const onContentSizeChange = (width: number, height: number) => {
    totalSize.value = horizontal ? width : height;

    scrollViewProps &&
      scrollViewProps.onContentSizeChange &&
      scrollViewProps.onContentSizeChange(width, height);
  };

  const onLayout = (event: any) => {
    const {
      nativeEvent: {
        layout: { width, height },
      },
    } = event;

    totalSize.value = horizontal ? width : height;

    scrollViewProps &&
      scrollViewProps.onLayout &&
      scrollViewProps.onLayout(event);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, contentSize, layoutMeasurement } = event;

      offset.value = horizontal ? contentOffset.x : contentOffset.y;
      totalSize.value = horizontal ? contentSize.width : contentSize.height;
      layoutSize.value = horizontal
        ? layoutMeasurement.width
        : layoutMeasurement.height;
    },
  });

  // event([
  //   {
  //     nativeEvent: {
  //       contentOffset: {
  //         [isHorizontal() ? "x" : "y"]: offset,
  //       },
  //       contentSize: {
  //         [measurementDirection()]: totalSize,
  //       },
  //       layoutMeasurement: {
  //         [measurementDirection()]: layoutSize,
  //       },
  //     },
  //   },
  // ]);

  const topOpacity = useAnimatedStyle(() => {
    return { opacity: interpolate(offset.value, [0, 10], [0, 1]) };
  });
  const bottomOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        totalSize.value - layoutSize.value - offset.value,
        [0, 10],
        [0, 1]
      ),
    };
  });

  return (
    <View style={containerStyle}>
      {/* {Platform.OS === "android" && (
        <Animated.Code>
          {() =>
            call(
              [this.offset, this.totalSize, this.layoutSize],
              ([offset, totalSize, layoutSize]) => {
                if (totalSize - (layoutSize + offset) < 0) {
                  if (!innerRef) {
                    return;
                  }
                  const ref =
                    "current" in innerRef ? innerRef.current : innerRef;
                  if (!ref) {
                    return;
                  }
                  ref.scrollToEnd({ animated: true });
                }
              }
            )
          }
        </Animated.Code>
      )} */}

      <Animated.ScrollView
        ref={innerRef}
        {...scrollViewProps}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onContentSizeChange={onContentSizeChange}
        onLayout={onLayout}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Animated.ScrollView>
      <View
        style={[$gradientContainer, horizontal && $horizontalGradientContainer]}
        pointerEvents={"none"}
      >
        <GradientView
          horizontal={horizontal}
          style={topOpacity}
          color={color}
        />
        <GradientView
          horizontal={horizontal}
          style={bottomOpacity}
          isBottom={true}
          color={color}
        />
      </View>
    </View>
  );
};

const $gradientContainer: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "space-between",
};

const $horizontalGradientContainer: ViewStyle = { flexDirection: "row" };
const $gradient: ViewStyle = { height: "100%", width: "100%" };
