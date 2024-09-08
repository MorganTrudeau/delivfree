import { listenToOrders } from "app/apis/orders";
import { Screen, Text } from "app/components";
import { DateRangeSelect } from "app/components/Dates/DateRangeSelect";
import { ScreenHeader } from "app/components/ScreenHeader";
import {
  $borderedArea,
  $containerPadding,
  $row,
  $screen,
} from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { DateFilter, getDateRangeByFilter } from "app/utils/dates";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import { DateRange, Order } from "delivfree";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

interface DriverTipsScreenProps extends AppStackScreenProps<"Tips"> {}

export const DriverTipsScreen = (props: DriverTipsScreenProps) => {
  const driver = useAppSelector((state) => state.driver.activeDriver);

  const [{ dateFilter, dateRange }, setDateRangeFilter] = useState<{
    dateFilter: DateFilter;
    dateRange: DateRange;
  }>({
    dateFilter: "today",
    dateRange: getDateRangeByFilter("today"),
  });

  const { startDate, endDate } = useMemo(
    () => ({
      startDate: moment(dateRange.start).valueOf(),
      endDate: moment(dateRange.end).valueOf(),
    }),
    [dateRange]
  );

  const handleDateRangeChange = useCallback(
    (_dateFilter: DateFilter, _dateRange: DateRange) => {
      setDateRangeFilter({ dateFilter: _dateFilter, dateRange: _dateRange });
    },
    []
  );

  const [orders, setOrders] = useState<Order[]>([]);

  const driverId = driver?.id;
  useEffect(() => {
    let unsubscribe = () => {};
    if (driverId && startDate && endDate) {
      setOrders([]);
      unsubscribe = listenToOrders(
        (orders) => {
          setOrders(orders);
        },
        {
          driver: driverId,
          startDate,
          endDate,
        }
      );
    }
    return unsubscribe;
  }, [driverId, startDate, endDate]);

  const { tips, numOrders } = useMemo(() => {
    return orders.reduce(
      (acc, order) =>
        order.tip
          ? {
              tips: (acc.tips || 0) + Number(order.tip),
              numOrders: (acc.numOrders || 0) + 1,
            }
          : acc,
      { tips: 0, numOrders: 0 } as { tips: number; numOrders: number }
    );
  }, [orders]);

  const tipAmount = useMemo(() => localizeCurrency(tips), [tips]);

  return (
    <Screen
      preset={"scroll"}
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <ScreenHeader title="Tips" />
      <DateRangeSelect
        dateFilter={dateFilter}
        dateRange={dateRange}
        onFilterByDate={handleDateRangeChange}
        style={{ marginBottom: spacing.sm }}
      />

      <View style={[$row, { columnGap: spacing.md, marginTop: spacing.sm }]}>
        <View style={[$borderedArea, { flex: 1 }]}>
          <Text>Orders</Text>
          <Text preset="subheading">{numOrders}</Text>
        </View>

        <View style={[$borderedArea, { flex: 1 }]}>
          <Text>Tips earned</Text>
          <Text preset="subheading">{tipAmount}</Text>
        </View>
      </View>
    </Screen>
  );
};
