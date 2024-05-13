import { colors, spacing, typography } from "app/theme";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { LineChart as CKLineChart } from "react-native-chart-kit";
import { ChartConfig, Dataset } from "react-native-chart-kit/dist/HelperTypes";
import { LineChartProps } from "react-native-chart-kit/dist/line-chart/LineChart";
import ForwardRefFadeView, { FadeViewRef } from "../FadeView";
import { Text } from "../Text";
import { $shadow } from "../styles";

const chartConfig: ChartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    backgroundColor: "#ffffff",
  },
  propsForDots: {
    r: "3",
  },
  propsForLabels: { fontFamily: typography.primary.normal },
};

type PointData = {
  index: number;
  value: number;
  dataset: Dataset;
  x: number;
  y: number;
  getColor: (opacity: number) => string;
};

export const LineChart = (props: LineChartProps) => {
  const pointView = useRef<FadeViewRef>(null);
  const [pointData, setPointData] = useState<PointData>();
  const handleDataPointClick = useCallback((data: PointData) => {
    setPointData(data);
    pointView.current?.fadeIn();
  }, []);
  const pointDataStyle = useMemo(
    () =>
      pointData
        ? StyleSheet.flatten([
            $pointContainer,
            $shadow,
            getPointDataVerticalPosition(pointData, props.height),
            getPointDataHorizontalPosition(pointData, props.width),
          ])
        : undefined,
    [pointData, props.height, props.width]
  );
  const handleMouseLeave = useCallback(() => {
    setPointData(undefined);
  }, []);
  return (
    // @ts-ignore
    <View onMouseLeave={handleMouseLeave}>
      <CKLineChart
        yAxisLabel="$"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={chartConfig}
        withHorizontalLines={false}
        bezier
        fromZero
        withShadow={false}
        style={{
          paddingVertical: spacing.sm,
          marginVertical: 8,
          borderRadius: 16,
        }}
        onDataPointClick={handleDataPointClick}
        onlyShowEndLabels={true}
        {...props}
      />
      {pointData && (
        <ForwardRefFadeView
          key={`${pointData.x}-${pointData.y}`}
          ref={pointView}
          pointerEvents={"none"}
          fadeInDuration={200}
          fadeOutDuration={200}
          style={pointDataStyle}
        >
          <Text style={$pointViewDate} allowFontScaling={false} size={"xs"}>
            {props.data.labels[pointData.index]}
          </Text>
          <View>
            <Text>
              {props.yAxisLabel || "$"}
              {pointData.value}
            </Text>
          </View>
        </ForwardRefFadeView>
      )}
    </View>
  );
};

const getPointDataHorizontalPosition = (
  pointData: PointData,
  chartWidth: number
) => {
  return pointData.x < chartWidth - 150
    ? { left: pointData.x }
    : {
        right: chartWidth - pointData.x,
      };
};

const getPointDataVerticalPosition = (
  pointData: PointData,
  chartHeight: number
) => {
  return pointData.y < 60
    ? { top: pointData.y }
    : { bottom: chartHeight - pointData.y };
};

const $pointViewDate: TextStyle = {
  marginBottom: spacing.xxs,
  color: colors.textDim,
};
const $pointContainer: ViewStyle = {
  position: "absolute",
  backgroundColor: colors.background,
  borderRadius: 5,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
};
