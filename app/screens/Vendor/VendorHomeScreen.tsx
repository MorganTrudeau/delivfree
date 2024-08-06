import { loadOrders } from "app/apis/orders";
import { getUser } from "app/apis/user";
import { Screen, Text } from "app/components";
import { LineChart } from "app/components/Charts/LineChart";
import { DateRangeSelect } from "app/components/Dates/DateRangeSelect";
import { LoadingPlaceholder } from "app/components/LoadingPlaceholder";
import { PayoutsHeader } from "app/components/Stripe/PayoutsHeader";
import { TaxRateSelect } from "app/components/Stripe/TaxRateSelect";
import {
  $containerPadding,
  $screen,
  LARGE_SCREEN,
  MAX_CONTAINER_WIDTH,
} from "app/components/styles";
import { SubscriptionNotice } from "app/components/Subscription/SubscriptionNotice";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { DateFilter, getDateRangeByFilter } from "app/utils/dates";
import { localizeCurrency } from "app/utils/general";
import { DateRange, Order, User, Vendor } from "delivfree";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { View, ViewStyle, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

const DATE_FORMAT = "MMM Do";

const TEST_CUSTOMERS = {
  a: "Jane White",
  b: "Tom Parker",
  c: "Barry Smith",
  d: "Rhonda Lee",
  e: "Grant Turner",
  f: "Tim Burnes",
  g: "Sarah Vitton"
};
const pickRandomCustomerId = () => {
  const keys = Object.keys(TEST_CUSTOMERS);
  return keys[Math.floor(Math.random() * keys.length)];
};

const TEST_ORDERS_TODAY: Pick<Order, "date" | "total">[] = new Array(10)
  .fill(0)
  .map((_, i) => ({
    total: (Math.floor(Math.random() * 1500) + 100).toFixed(2),
    date: moment()
      .hour(i + 9)
      .valueOf(),
  }));

const TEST_ORDERS_OVERVIEW: Pick<Order, "date" | "total" | "customer">[] =
  new Array(7).fill(1).map((days, index) => ({
    date: moment()
      .subtract(index + 1, "days")
      .valueOf(),
    total: (Math.floor(Math.random() * 6000) + 1000).toFixed(2),
    customer: pickRandomCustomerId(),
  }));

export const VendorHomeScreen = (props: HomeScreenProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const largeScreenLayout = width > LARGE_SCREEN;

  const vendor = useAppSelector((state) => state.vendor.activeVendor as Vendor);
  const vendorId = vendor?.id;

  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [overviewOrders, setOverviewOrders] = useState<Order[]>([]);
  const [overviewDateState, setOverviewDateState] = useState<{
    filter: DateFilter;
    range: DateRange;
  }>({ filter: "last7", range: getDateRangeByFilter("last7") });

  // const { setAlwaysOpen } = useDrawer();
  // useEffect(() => {
  //   setAlwaysOpen(largeScreenLayout);
  // }, [largeScreenLayout]);

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
          .reduce((acc, order) => acc + Number(order.total || 0), 0);
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
            .reduce((acc, order) => acc + Number(order.total || 0), 0);
        });
    } else {
      const start = moment(overviewDateState.range.start);
      const days = Math.max(1, diff / 6);

      const sales: number[] = [];

      while (!start.isAfter(overviewDateState.range.end, "day")) {
        const total = overviewOrders
          .filter((o) =>
            moment(o.date).isBetween(start, moment(start).add(days, "days"))
          )
          .reduce((acc, order) => acc + Number(order.total || 0), 0);
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
      const dayDiff = Math.max(1, diff / 6);
      const labels: string[] = [];

      while (!start.isAfter(end)) {
        let label = start.format(DATE_FORMAT);
        if (dayDiff > 1) {
          let endLabel = start.clone().add(dayDiff, "days");
          if (endLabel.isAfter(end)) {
            endLabel = end.clone();
          }
          label =
            label +
            (!endLabel.isSame(start, "day")
              ? " - " + endLabel.format(DATE_FORMAT)
              : "");
        }
        labels.push(label);
        start.add(dayDiff, "days");
      }
      return labels;
    }
  }, [overviewDateState.range]);

  const customerSales = useMemo(() => {
    const mappedSales = overviewOrders.reduce((acc, order) => {
      return {
        ...acc,
        [order.customer]: {
          customer: order.customer,
          spend: (acc[order.customer]?.spend || 0) + Number(order.total || 0),
        },
      };
    }, {} as { [customer: string]: { customer: string; spend: number } });
    return Object.values(mappedSales);
  }, [overviewOrders]);

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
    <Screen
      preset={"scroll"}
      style={$screen}
      contentContainerStyle={[
        $containerPadding,
        { paddingBottom: insets.bottom + spacing.sm },
      ]}
    >
      <SubscriptionNotice style={{ marginBottom: spacing.md }} />
      <PayoutsHeader vendor={vendor} style={$payouts} />
      <TaxRateSelect vendor={vendor} style={$taxRates} />
      <Text preset="heading">Today</Text>
      <View style={{ paddingVertical: spacing.md }}>
        <Text>Gross volume</Text>
        <Text preset="subheading">{grossVolumeToday}</Text>
        <LineChart
          width={Math.min(
            1000,
            Math.min(MAX_CONTAINER_WIDTH, width) * (largeScreenLayout ? 1 : 0.9)
          )}
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
            width={Math.min(450, width * (largeScreenLayout ? 0.35 : 0.9))}
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
              maxHeight: 300,
            }}
          >
            {customerSales.length > 0 ? (
              customerSales.map(({ customer, spend }) => {
                return (
                  <CustomerSale
                    key={customer}
                    userId={customer}
                    spend={spend}
                  />
                );
              })
            ) : (
              <View style={{ paddingVertical: spacing.xxs }}>
                <Text preset="semibold">No sales recorded</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Screen>
  );
};

const CustomerSale = ({ userId, spend }: { userId: string; spend: number }) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUser(userId);
        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.log("Failed to load customer", error);
      }
    };
    load();
  }, []);

  return (
    <View
      style={[
        {
          paddingVertical: spacing.xxs,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <LoadingPlaceholder
        loading={!user}
        loadingStyle={{ marginBottom: spacing.xxs, maxWidth: 150 }}
      >
        <Text>
          {user?.firstName} {user?.lastName}
        </Text>
      </LoadingPlaceholder>
      <Text>{localizeCurrency(spend)}</Text>
    </View>
  );
};

const $payouts: ViewStyle = { marginBottom: spacing.sm };
const $taxRates: ViewStyle = {
  marginBottom: spacing.lg,
  alignSelf: "flex-start",
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
