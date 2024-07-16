import { fetchDriver } from "app/apis/driver";
import { listenToOrders } from "app/apis/orders";
import { Screen, Text } from "app/components";
import { DateRangeSelect } from "app/components/Dates/DateRangeSelect";
import { EmptyList } from "app/components/EmptyList";
import { LoadingPlaceholder } from "app/components/LoadingPlaceholder";
import { ScreenHeader } from "app/components/ScreenHeader";
import {
  $borderBottomLight,
  $containerPadding,
  $row,
  $screen,
} from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import { DateFilter, getDateRangeByFilter } from "app/utils/dates";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import { DateRange, Driver, Order } from "delivfree";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";

interface VendorTipsScreenProps extends AppStackScreenProps<"Tips"> {}

export const VendorTipsScreen = (props: VendorTipsScreenProps) => {
  const [{ dateFilter, dateRange }, setDateRangeFilter] = useState<{
    dateFilter: DateFilter;
    dateRange: DateRange;
  }>({
    dateFilter: "last7",
    dateRange: getDateRangeByFilter("last7"),
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

  useEffect(() => {
    setOrders([]);
    return listenToOrders(
      (orders) => {
        setOrders(orders);
      },
      {
        startDate,
        endDate,
      }
    );
  }, [startDate, endDate]);

  const driverTipData = useMemo(() => {
    const map = orders.reduce(
      (acc, order) =>
        order.driver && order.tip
          ? {
              ...acc,
              [order.driver]: {
                driver: order.driver,
                tips: (acc[order.driver]?.tips || 0) + Number(order.tip),
                numOrders: (acc[order.driver]?.numOrders || 0) + 1,
              },
            }
          : acc,
      {} as {
        [driver: string]: { driver: string; tips: number; numOrders: number };
      }
    );
    return Object.values(map);
  }, [orders]);

  const renderTipItem = useCallback(
    ({
      item,
    }: {
      item: { driver: string; tips: number; numOrders: number };
    }) => {
      return (
        <DriverTipItem
          driver={item.driver}
          tips={item.tips}
          numOrders={item.numOrders}
        />
      );
    },
    []
  );

  const renderEmpty = useCallback(
    () => <EmptyList title={"No orders completed in this date range"} />,
    []
  );

  return (
    <Screen style={$screen} contentContainerStyle={$containerPadding}>
      <ScreenHeader title="Tips" />
      <DateRangeSelect
        dateFilter={dateFilter}
        dateRange={dateRange}
        onFilterByDate={handleDateRangeChange}
        style={{ marginBottom: spacing.sm }}
      />
      <FlatList
        data={driverTipData}
        renderItem={renderTipItem}
        ListEmptyComponent={renderEmpty}
      />
    </Screen>
  );
};

const DriverTipItem = React.memo(function DriverTipItem({
  driver,
  tips,
  numOrders,
}: {
  driver: string;
  tips: number;
  numOrders: number;
}) {
  const [driverData, setDriverData] = useState<Driver | null>();

  const loadDriver = useCallback(async () => {
    const data = await fetchDriver(driver);
    setDriverData(data || null);
  }, [driver]);

  useEffect(() => {
    loadDriver();
  }, [loadDriver]);

  const tipAmount = useMemo(() => localizeCurrency(tips), [tips]);

  return (
    <View style={[{ paddingVertical: spacing.sm }, $borderBottomLight]}>
      <LoadingPlaceholder loading={driverData === undefined}>
        {driverData ? (
          <Text>
            {driverData?.firstName} {driverData?.lastName}
          </Text>
        ) : (
          <Text>Driver not found</Text>
        )}
      </LoadingPlaceholder>
      <View style={$row}>
        <Text preset="semibold">
          {numOrders} {pluralFormat("Order", numOrders)}
        </Text>
        <Text preset="semibold"> • {tipAmount} Tips</Text>
      </View>
    </View>
  );
});
