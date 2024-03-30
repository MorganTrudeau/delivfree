import { Icon, Screen, Text } from "app/components";
import { LineChart } from "app/components/Charts/LineChart";
import { Drawer } from "app/components/Drawer";
import { $containerPadding, $flex, $row, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { colors, spacing, typography } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { sizing } from "app/theme/sizing";
import { localizeCurrency } from "app/utils/general";
import moment from "moment";
import React, { useMemo, useRef } from "react";
import { View, useWindowDimensions } from "react-native";

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

const todaySales = [
  Math.random() * 500,
  Math.random() * 500,
  Math.random() * 500,
  Math.random() * 500,
  Math.random() * 500,
  Math.random() * 500,
];

const overviewSales = new Array(7).fill(0).map(() => Math.random() * 5000);

const customerSales = [
  { name: "James", spend: "$590.99", phone: "778-898-0345" },
  { name: "Sarah", spend: "$338.99", phone: "604-772-2292" },
  { name: "Lina", spend: "$150.99", phone: "778-251-9828" },
  { name: "Rod", spend: "$128.50", phone: "778-555-9521" },
  { name: "Gary", spend: "$89.99", phone: "778-877-2212" },
];

const DATE_FORMAT = "MMM Do";

export const VendorHomeScreen = (props: HomeScreenProps) => {
  const { width } = useWindowDimensions();

  const grossVolumeToday = useMemo(() => {
    return localizeCurrency(
      todaySales.reduce((acc, num) => acc + num, 0),
      "USD"
    );
  }, []);

  const grossVolumeOverview = useMemo(() => {
    return localizeCurrency(
      overviewSales.reduce((acc, num) => acc + num, 0),
      "USD"
    );
  }, []);

  const overviewLabels = useMemo(() => {
    let start = moment().subtract(8, "days");
    let end = moment().subtract(1, "days");
    const diff = end.diff(start, "days");

    const labels = new Array(diff).fill("");

    labels[0] = start.format(DATE_FORMAT);
    labels[labels.length - 1] = end.format(DATE_FORMAT);

    return labels;
  }, []);

  const renderOverviewDateRangeSelect = () => {
    return (
      <View
        style={[
          $row,
          {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            borderColor: colors.border,
            alignSelf: "flex-start",
            marginTop: spacing.xs,
          },
        ]}
      >
        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: colors.border,
            flex: 1,
            paddingHorizontal: spacing.xs,
            paddingVertical: spacing.xxs,
          }}
        >
          <Text>Last 7 days</Text>
        </View>
        <View
          style={[
            $row,
            { paddingHorizontal: spacing.xs, paddingVertical: spacing.xxs },
          ]}
        >
          <Icon
            icon={"calendar"}
            style={{ marginRight: spacing.xs }}
            size={sizing.md}
          />
          <Text>
            {moment().subtract(8, "days").format("MMM Do")} -{" "}
            {moment().subtract(1, "days").format("MMM Do")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset={"scroll"}
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <Text preset="heading">Today</Text>
        <View style={{ paddingVertical: spacing.md }}>
          <Text>Gross volume</Text>
          <Text preset="subheading">{grossVolumeToday}</Text>
          <LineChart
            width={Math.min(1000, width * 0.8)}
            height={300}
            data={{
              labels: ["12:00am", "", "", "", "", "11.59pm"],
              datasets: [
                {
                  data: todaySales,
                  color: () => colors.primary,
                },
              ],
            }}
          />
        </View>

        <Text preset="heading">Your Overview</Text>
        {renderOverviewDateRangeSelect()}
        <View
          style={{
            paddingVertical: spacing.md,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: spacing.xl,
          }}
        >
          <View>
            <Text>Gross volume</Text>
            <Text preset="subheading">{grossVolumeOverview}</Text>
            <LineChart
              width={Math.min(450, width * 0.35)}
              height={300}
              data={{
                labels: overviewLabels,
                datasets: [
                  {
                    data: overviewSales,
                    color: () => colors.primary,
                  },
                ],
              }}
            />
          </View>

          <View>
            <Text>Top customers by spend</Text>
            <View
              style={{
                paddingVertical: spacing.sm,
                width: Math.min(450, width * 0.35),
                height: 300,
              }}
            >
              {customerSales.map(({ name, spend, phone }) => {
                return (
                  <View
                    key={name}
                    style={[
                      $row,
                      {
                        paddingVertical: spacing.xxs,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={$flex}>
                      <Text>{name}</Text>
                      <Text size="xs" style={{ color: colors.textDim }}>
                        {phone}
                      </Text>
                    </View>
                    <Text>{spend}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Screen>
    </Drawer>
  );
};
