import { loadOrders } from "app/apis/orders";
import { Icon, Screen, Text } from "app/components";
import { LineChart } from "app/components/Charts/LineChart";
import { DateRangeSelect } from "app/components/Dates/DateRangeSelect";
import { Drawer } from "app/components/Drawer";
import {
  $containerPadding,
  $flex,
  $row,
  $screen,
  LARGE_SCREEN,
} from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { sizing } from "app/theme/sizing";
import { DateFilter, getDateRangeByFilter } from "app/utils/dates";
import { localizeCurrency } from "app/utils/general";
import { Customer, DateRange, Order } from "delivfree";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

// const todaySales = [
//   Math.random() * 500,
//   Math.random() * 500,
//   Math.random() * 500,
//   Math.random() * 500,
//   Math.random() * 500,
//   Math.random() * 500,
// ];

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
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const largeScreenLayout = width > LARGE_SCREEN;

  const customers = useAppSelector((state) => state.customers.data);
  const vendor = useAppSelector((state) => state.vendor.data);
  const vendorId = vendor?.id;

  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [overviewOrders, setOverviewOrders] = useState<Order[]>([]);
  const [overviewDateState, setOverviewDateState] = useState<{
    filter: DateFilter;
    range: DateRange;
  }>({ filter: "last7", range: getDateRangeByFilter("last7") });

  useEffect(() => {
    if (vendorId) {
      const loadTodaysOrders = async () => {
        const orders = await loadOrders({ vendor: vendorId }, [
          ["date", ">=", moment().startOf("day").valueOf()],
          ["date", "<=", moment().endOf("day").valueOf()],
        ]);
        setTodaysOrders(orders);
      };
      loadTodaysOrders();
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorId) {
      const loadOverviewOrders = async () => {
        const orders = await loadOrders({ vendor: vendorId }, [
          ["date", ">=", moment(overviewDateState.range.start).valueOf()],
          ["date", "<=", moment(overviewDateState.range.end).valueOf()],
        ]);
        setOverviewOrders(orders);
      };
      loadOverviewOrders();
    }
  }, [vendorId, overviewDateState.range.start, overviewDateState.range.end]);

  const todaysSales = useMemo(() => {
    return Array(24)
      .fill(0)
      .map((n, i) => {
        const hour = moment().hour(i);
        return todaysOrders
          .filter((o) => moment(o.date).isSame(hour, "hour"))
          .reduce((acc, order) => acc + Number(order.amount), 0);
      });
  }, [todaysOrders]);

  const grossVolumeToday = useMemo(() => {
    return localizeCurrency(
      todaysSales.reduce((acc, num) => acc + num, 0),
      "USD"
    );
  }, [todaysSales]);

  const overviewSales = useMemo(() => {
    const diff = moment(overviewDateState.range.end).diff(
      overviewDateState.range.start,
      "days"
    );

    if (diff < 1) {
      return Array(24)
        .fill(0)
        .map((n, i) => {
          const hour = moment(overviewDateState.range.start).hour(i);
          return overviewOrders
            .filter((o) => moment(o.date).isSame(hour, "hour"))
            .reduce((acc, order) => acc + Number(order.amount), 0);
        });
    } else {
      let start = moment(overviewDateState.range.start);
      const days = diff / 6;

      const sales: number[] = [];
      overviewOrders.forEach((o) => console.log(moment(o.date).format()));

      while (!start.isAfter(overviewDateState.range.end, "day")) {
        const total = overviewOrders
          .filter((o) =>
            moment(o.date).isBetween(start, moment(start).add(days, "days"))
          )
          .reduce((acc, order) => acc + Number(order.amount), 0);
        sales.push(total);
        start.add(days, "days");
      }

      return sales;
    }
  }, [overviewOrders]);

  const grossVolumeOverview = useMemo(() => {
    return localizeCurrency(
      overviewSales.reduce((acc, num) => acc + num, 0),
      "USD"
    );
  }, [overviewSales]);

  const overviewLabels = useMemo(() => {
    const start = moment(overviewDateState.range.start);
    const end = moment(overviewDateState.range.end);
    const diff = end.diff(start, "days");

    if (diff < 1) {
      return todaysLabels;
    } else {
      const dayDiff = diff / 6;
      const labels: string[] = [];
      while (!start.isAfter(end)) {
        let label = start.format(DATE_FORMAT);
        if (dayDiff > 1) {
          let endLabel = start.clone().add(dayDiff, "days");
          if (endLabel.isAfter(end)) {
            endLabel = end.clone();
          }
          label = label + " - " + endLabel.format(DATE_FORMAT);
        }
        labels.push(label);
        start.add(dayDiff, "days");
      }
      return labels;
    }
  }, [overviewDateState.range]);

  const customerSales = useMemo(() => {
    const mappedSales = overviewOrders.reduce((acc, order) => {
      const customer = customers[order.customer];
      if (!customer) {
        return acc;
      }
      return {
        ...acc,
        [order.customer]: {
          customer: customer,
          spend:
            (acc[order.customer]?.spend || 0) +
            Number(order.amount) +
            Number(order.tip),
        },
      };
    }, {} as { [customer: string]: { customer: Customer; spend: number } });
    return Object.values(mappedSales);
  }, [overviewOrders, customers]);

  const renderOverviewDateRangeSelect = () => {
    return (
      <DateRangeSelect
        dateFilter={overviewDateState.filter}
        dateRange={overviewDateState.range}
        onFilterByDate={(filter, range) => {
          setOverviewDateState({ filter, range });
        }}
      />
    );
  };

  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset={"scroll"}
        style={$screen}
        contentContainerStyle={[
          $containerPadding,
          { paddingBottom: insets.bottom + spacing.sm },
        ]}
        inDrawer
      >
        <Text preset="heading">Today</Text>
        <View style={{ paddingVertical: spacing.md }}>
          <Text>Gross volume</Text>
          <Text preset="subheading">{grossVolumeToday}</Text>
          <LineChart
            width={Math.min(1000, width * (largeScreenLayout ? 0.8 : 1))}
            height={300}
            data={{
              labels: todaysLabels,
              datasets: [
                {
                  data: todaysSales,
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
            flexDirection: largeScreenLayout ? "row" : undefined,
            flexWrap: largeScreenLayout ? "wrap" : undefined,
            gap: largeScreenLayout ? spacing.xl : undefined,
          }}
        >
          <View>
            <Text>Gross volume</Text>
            <Text preset="subheading">{grossVolumeOverview}</Text>
            <LineChart
              width={Math.min(450, width * (largeScreenLayout ? 0.35 : 1))}
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
                width: largeScreenLayout
                  ? Math.min(450, width * 0.35)
                  : undefined,
                height: 300,
              }}
            >
              {customerSales.map(({ customer, spend }) => {
                return (
                  <View
                    key={customer.id}
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
                      <Text>{customer.name}</Text>
                      <Text size="xs" style={{ color: colors.textDim }}>
                        {customer.phoneNumber}
                      </Text>
                    </View>
                    <Text>${spend.toFixed(2)}</Text>
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

const todaysLabels = [
  "12:00am",
  "1:00am",
  "2:00am",
  "3:00am",
  "4:00am",
  "5:00am",
  "6:00am",
  "7:00am",
  "8:00am",
  "9:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
  "4:00pm",
  "5:00pm",
  "6:00pm",
  "7:00pm",
  "8:00pm",
  "9:00pm",
  "10:00pm",
  "11:00pm",
  "11.59pm",
];
