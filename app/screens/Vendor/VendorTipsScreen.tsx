import { fetchDriver } from "app/apis/driver";
import { fetchLicenses } from "app/apis/licenses";
import { listenToOrders } from "app/apis/orders";
import { Screen, Text } from "app/components";
import { CalendarButton } from "app/components/Dates/CalendarButton";
import { CalendarModal } from "app/components/Dates/CalendarModal";
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
import { VendorLocationSelect } from "app/components/VendorLocation/VendorLocationSelect";
import { AppStackScreenProps } from "app/navigators";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { DateFilter, getDateRangeByFilter } from "app/utils/dates";
import { localizeCurrency, pluralFormat } from "app/utils/general";
import { DateRange, Driver, License, Order } from "delivfree";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";

interface VendorTipsScreenProps extends AppStackScreenProps<"Tips"> {}

export const VendorTipsScreen = (props: VendorTipsScreenProps) => {
  const [date, setDate] = useState(moment().toDate());
  const [selectedVendorLocation, setSelectedVendorLocation] = useState("");

  const handleChangeDate = (_date: Date) => {
    setDate(_date);
  };

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders([]);
    const startDate = moment(date).startOf("day").valueOf();
    const endDate = moment(date).endOf("day").valueOf();
    return listenToOrders(
      (orders) => {
        setOrders(orders);
      },
      {
        startDate,
        endDate,
        vendorLocation: selectedVendorLocation,
      }
    );
  }, [date, selectedVendorLocation]);

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
          vendorLocation={selectedVendorLocation}
          driver={item.driver}
          tips={item.tips}
          numOrders={item.numOrders}
        />
      );
    },
    [selectedVendorLocation]
  );

  const renderEmpty = useCallback(
    () => <EmptyList title={"No orders completed on this day"} />,
    []
  );

  return (
    <Screen style={$screen} contentContainerStyle={$containerPadding}>
      <ScreenHeader title="Tips" />
      <VendorLocationSelect
        selectedLocationId={selectedVendorLocation}
        onSelect={(vendorLocation) =>
          setSelectedVendorLocation(vendorLocation.id)
        }
        style={{ alignSelf: "flex-start" }}
      />
      <CalendarButton
        date={date}
        setDate={handleChangeDate}
        style={{ alignSelf: "flex-start", marginTop: spacing.sm }}
        dayPressUpdates={true}
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
  vendorLocation,
}: {
  vendorLocation: string;
  driver: string;
  tips: number;
  numOrders: number;
}) {
  const [driverData, setDriverData] = useState<Driver | null>();
  const [positionType, setPositionType] = useState<"full-time" | "part-time">();

  const loadDriver = useCallback(async () => {
    const _driverData = await fetchDriver(driver);
    setDriverData(_driverData || null);
    const _licences = await fetchLicenses({ driver, vendorLocation });
    const _positionType =
      _licences[0].fullTimePositions > 0 ? "full-time" : "part-time";
    setPositionType(_positionType);
  }, [driver]);

  useEffect(() => {
    loadDriver();
  }, [loadDriver]);

  const tipAmount = useMemo(() => localizeCurrency(tips), [tips]);

  const tipTopUp = useMemo(() => {
    return Math.max(0, (positionType === "full-time" ? 24 : 12) * 7 - tips);
  }, [positionType, numOrders, tips]);

  const tipTopUpAmount = useMemo(() => localizeCurrency(tipTopUp), [tipTopUp]);
  const tipTopUpTotal = useMemo(
    () => localizeCurrency(tipTopUp + tips),
    [tips, tipTopUp]
  );

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
      {!!tipTopUp && (
        <View
          style={{
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: borderRadius.md,
            padding: spacing.xs,
            alignSelf: "flex-start",
            marginTop: spacing.xxs,
          }}
        >
          <Text>
            Tip Top-up: <Text preset="semibold">{tipTopUpAmount}</Text>
          </Text>
          <Text>
            Total tips with top-up:{" "}
            <Text preset="semibold">{tipTopUpTotal}</Text>
          </Text>
        </View>
      )}
    </View>
  );
});
