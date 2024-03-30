import { spacing, typography } from "app/theme";
import React from "react";
import { LineChart as CKLineChart } from "react-native-chart-kit";
import { ChartConfig } from "react-native-chart-kit/dist/HelperTypes";
import { LineChartProps } from "react-native-chart-kit/dist/line-chart/LineChart";

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
    r: "5",
  },
  propsForLabels: { fontFamily: typography.primary.normal },
};

export const LineChart = (props: LineChartProps) => {
  return (
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
      {...props}
    />
  );
};
