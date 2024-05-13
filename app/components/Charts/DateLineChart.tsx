import React, { useCallback, useMemo, useRef, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { ChartConfig, Dataset } from "react-native-chart-kit/dist/HelperTypes";

import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewProps,
  TouchableOpacityProps,
} from "react-native";
import ForwardRefFadeView, { FadeViewRef } from "../FadeView";
import moment from "moment";
import { $row, $shadow } from "../styles";
import { useOnChange } from "app/hooks";
import { colors, spacing, typography } from "app/theme";

type DateRange = { start: string; end: string };

// @ts-ignore
const ChartWrapper: React.ComponentType<ViewProps | TouchableOpacityProps> =
  Platform.OS === "web" ? View : TouchableOpacity;

export const DateLineChart = ({
  data,
  startDate,
  endDate,
  height,
  width,
  getDataDate,
  getDataValue,
}: {
  data: any[];
  startDate: string;
  endDate: string;
  height: number;
  width: number;
  getDataDate: (d: any) => string;
  getDataValue: (d: any) => number;
}) => {
  const dateGroups = useMemo(() => {
    return generateDateGroupLabels({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const labels = useMemo(() => {
    const _labels = new Array(dateGroups.length).fill("");
    _labels[0] = moment(startDate).format("MMM DD");
    _labels[_labels.length - 1] = moment(endDate).format("MMM DD");
    return _labels;
  }, [startDate, endDate, dateGroups]);

  const dataSets: Dataset[] = useMemo(() => {
    const dataSetMap: { [date: string]: number } = {};

    data.forEach((d) => {
      const dateGroup = calculateDateGroup(
        { start: startDate, end: endDate },
        getDataDate(d)
      );
      dataSetMap[dateGroup] = (dataSetMap[dateGroup] || 0) + getDataValue(d);
    });

    const mapToDataSets = (map: { [date: string]: number }): Dataset[] => {
      const _dataSets: Dataset = { data: [] };

      dateGroups.forEach((dateGroup) => {
        const value = map[dateGroup] || 0;
        _dataSets.data = _dataSets.data || [];
        _dataSets.data.push(value);
        _dataSets.key = dateGroup;
      });

      return [_dataSets];
    };

    return mapToDataSets(dataSetMap);
  }, [data, startDate, endDate, dateGroups]);

  const chartData = useMemo(
    () => ({
      labels: labels,
      datasets: dataSets,
    }),
    [labels, dataSets]
  );

  console.log("DATA", dataSets);

  // POINTS

  const pointView = useRef<FadeViewRef>(null);

  const [pointData, setPointData] = useState<PointData>();
  const pointDataKey = pointData?.dataset.key as string | undefined;
  //   const pointDataTask = useMemo(
  //     () => (pointDataKey ? workDayTasks.get(pointDataKey) : null),
  //     [pointDataKey]
  //   );

  const handleDataPointClick = useCallback((data: PointData) => {
    setPointData(data);
    pointView.current?.fadeIn();
  }, []);

  const handleClosePointView = useCallback(
    () => pointView.current?.fadeOut(),
    []
  );

  const pointDataStyle = useMemo(
    () =>
      pointData
        ? StyleSheet.flatten([
            styles.pointContainer,
            $shadow,
            getPointDataVerticalPosition(pointData, height),
            getPointDataHorizontalPosition(pointData, width),
          ])
        : undefined,
    [pointData, height, width]
  );

  const pointDotStyle = useMemo(
    () =>
      pointData
        ? [styles.pointDot, { backgroundColor: pointData.getColor(1) }]
        : undefined,
    [pointData]
  );

  useOnChange(startDate, () => {
    pointView.current?.fadeOut();
  });
  useOnChange(endDate, () => {
    pointView.current?.fadeOut();
  });
  useOnChange(height, () => {
    pointView.current?.fadeOut();
  });
  useOnChange(width, () => {
    pointView.current?.fadeOut();
  });

  // POINTS END

  return (
    <View style={{ height: height * 0.75 + 60 }}>
      <ChartWrapper
        style={styles.touchableContainer}
        onPress={handleClosePointView}
      >
        <LineChart
          data={chartData}
          width={width}
          height={height}
          yAxisLabel={"$"}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          bezier
          withShadow={false}
          withVerticalLines={false}
          onDataPointClick={handleDataPointClick}
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
            <Text style={styles.pointViewDate} allowFontScaling={false}>
              {formatDateGroup(dateGroups[pointData.index])}
            </Text>
            {/* {pointDataTask && (
              <View style={styles.pointViewTask}>
                <View style={pointDotStyle} />
                <Text ellipsizeMode={"tail"} numberOfLines={1}>
                  {pointDataTask.title}
                </Text>
              </View>
            )} */}
            <View style={$row}>
              <Text>{formatValue(pointData.value)}</Text>
            </View>
          </ForwardRefFadeView>
        )}
      </ChartWrapper>
    </View>
  );
};

type PointData = {
  index: number;
  value: number;
  dataset: Dataset;
  x: number;
  y: number;
  getColor: (opacity: number) => string;
};

const NUM_GROUPS = 8;
const PADDING_LEFT = 0;

const getPointDataHorizontalPosition = (
  pointData: PointData,
  chartWidth: number
) => {
  return pointData.x < chartWidth - 150
    ? { left: pointData.x + PADDING_LEFT }
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

const formatDateGroup = (dateGroup: string | undefined) => {
  if (!dateGroup) {
    return "";
  }
  if (dateGroup.length === 10) {
    return moment(dateGroup).format("MMM DD");
  } else {
    const start = dateGroup.substring(0, 10);
    const end = dateGroup.substring(11);
    console.log(start, end);
    return formatDateRange({ start, end });
  }
};

export function formatDateRange(dateRange: DateRange, includeYear?: boolean) {
  const { start, end } = dateRange;

  const datesNotInThisYear = (() => {
    const m = moment();

    return !m.isSame(start, "year") || !m.isSame(end, "year");
  })();

  return (
    moment(start).format(`MMM D${datesNotInThisYear ? " YYYY" : ""}`) +
    " - " +
    moment(end).format(
      `MMM D${datesNotInThisYear || includeYear ? " YYYY" : ""}`
    )
  );
}

const generateDateGroupLabels = (dateRange: DateRange) => {
  const startDate = moment(dateRange.start);
  const endDate = moment(dateRange.end);
  const totalDays = endDate.diff(startDate, "days") + 1;

  let labels: string[] = [];

  if (endDate.isSame(startDate, "day")) {
    const numHours = endDate.diff(startDate, "hours") + 1;
    for (let i = 0; i < numHours; i++) {
      const labelDate = startDate.clone().add(i, "days");
      labels.push(labelDate.format("h:mma"));
    }
  } else if (totalDays <= NUM_GROUPS) {
    // For ranges of 7 days or less, each date is its own label
    for (let i = 0; i < totalDays; i++) {
      const labelDate = startDate.clone().add(i, "days");
      labels.push(labelDate.format("YYYY-MM-DD"));
    }
  } else {
    // Calculate the interval needed to create up to 7 groups
    const daysPerGroup = Math.ceil(totalDays / NUM_GROUPS);

    let currentStart = startDate;
    while (currentStart.isBefore(endDate, "day")) {
      // Calculate end date of the current group, without exceeding the overall end date
      let currentEnd = moment.min(
        currentStart.clone().add(daysPerGroup - 1, "days"),
        endDate
      );

      // Create label for the current group
      const label = `${currentStart.format("YYYY-MM-DD")}-${currentEnd.format(
        "YYYY-MM-DD"
      )}`;
      labels.push(label);

      // Move to the next group
      currentStart = currentEnd.add(1, "days");
    }
  }

  return labels;
};

const calculateDateGroup = (dateRange: DateRange, singleDate: string) => {
  const startDate = moment(dateRange.start);
  const endDate = moment(dateRange.end);
  const dataDate = moment(singleDate);

  // Calculate total days in the range
  const totalDays = endDate.diff(startDate, "days") + 1;

  // If 7 or less days, return the single date
  if (totalDays <= NUM_GROUPS) {
    return singleDate;
  }

  // Calculate days per group to have max 7 points
  const daysPerGroup = Math.ceil(totalDays / NUM_GROUPS);

  // Determine the group for the single date
  const daysFromStart = dataDate.diff(startDate, "days");
  const groupNumber = Math.floor(daysFromStart / daysPerGroup);

  // Calculate the start and end date of the group
  let groupStartDate = startDate.add(groupNumber * daysPerGroup, "days");
  let groupEndDate = moment.min(
    groupStartDate.clone().add(daysPerGroup - 1, "days"),
    endDate
  );

  // Format the group label
  const groupLabel = `${groupStartDate.format(
    "YYYY-MM-DD"
  )}-${groupEndDate.format("YYYY-MM-DD")}`;

  return groupLabel;
};

const formatValue = (val: number) => {
  return "$" + val.toFixed(2);
};

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
  propsForLabels: Platform.select({
    default: { fontFamily: typography.primary.medium },
    ios: undefined,
  }),
};

const styles = StyleSheet.create({
  chart: {
    borderRadius: 6,
  },
  touchableContainer: {
    alignSelf: "flex-start",
    paddingLeft: PADDING_LEFT,
  },
  pointViewDate: StyleSheet.flatten([
    // globalStyles.textSmallMeta,
    { marginBottom: spacing.xs },
  ]),
  pointDot: {
    height: 14,
    width: 14,
    borderRadius: 10,
    marginEnd: spacing.sm,
  },
  pointContainer: {
    position: "absolute",
    backgroundColor: colors.background,
    borderRadius: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pointViewTask: StyleSheet.flatten([
    $row,
    { maxWidth: 150, marginBottom: spacing.xs },
  ]),
});
