import { fetchLicenses } from "app/apis/licenses";
import { listenToOrders } from "app/apis/orders";
import { Screen, Text } from "app/components";
import { CalendarButton } from "app/components/Dates/CalendarButton";
import { ScreenHeader } from "app/components/ScreenHeader";
import {
  $borderedArea,
  $containerPadding,
  $row,
  $screen,
} from "app/components/styles";
import { VendorLocationSelect } from "app/components/VendorLocation/VendorLocationSelect";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { localizeCurrency } from "app/utils/general";
import { Order } from "delivfree";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

interface DriverTipsScreenProps extends AppStackScreenProps<"Tips"> {}

export const DriverTipsScreen = (props: DriverTipsScreenProps) => {
  const driver = useAppSelector((state) => state.driver.activeDriver);

  const [selectedVendorLocation, setSelectedVendorLocation] = useState("");
  const [date, setDate] = useState(moment().toDate());
  const [orders, setOrders] = useState<Order[]>([]);
  const [positionType, setPositionType] = useState<
    "full-time" | "part-time" | "flex"
  >();

  const handleChangeDate = (_date: Date) => {
    setDate(_date);
  };

  const driverId = driver?.id;
  useEffect(() => {
    setOrders([]);
    let unsubscribe = () => {};
    const startDate = moment(date).startOf("day").valueOf();
    const endDate = moment(date).endOf("day").valueOf();
    if (driverId) {
      unsubscribe = listenToOrders(
        (orders) => {
          setOrders(orders);
        },
        {
          driver: driverId,
          startDate,
          endDate,
          vendorLocation: selectedVendorLocation,
        }
      );
    }
    return unsubscribe;
  }, [driverId, date]);

  useEffect(() => {
    setPositionType(undefined);
    if (driverId && selectedVendorLocation) {
      const loadPositionType = async () => {
        const _licences = await fetchLicenses({
          driver: driverId,
          vendorLocation: selectedVendorLocation,
        });
        const _positionType = _licences[0].flexDriver
          ? "flex"
          : _licences[0].fullTimePositions > 0
          ? "full-time"
          : "part-time";
        setPositionType(_positionType);
      };
      loadPositionType();
    }
  }, [driverId, selectedVendorLocation]);

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

  const tipTopUp = useMemo(() => {
    return Math.max(
      0,
      (positionType === "flex"
        ? numOrders
        : positionType === "full-time"
        ? 24
        : 12) *
        7 -
        tips
    );
  }, [positionType, numOrders, tips]);

  const tipTopUpAmount = useMemo(() => localizeCurrency(tipTopUp), [tipTopUp]);
  const tipTopUpTotal = useMemo(
    () => localizeCurrency(tipTopUp + tips),
    [tips, tipTopUp]
  );

  return (
    <Screen
      preset={"scroll"}
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
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

      <View
        style={{
          flexDirection: "row",
          columnGap: spacing.md,
          marginTop: spacing.lg,
        }}
      >
        <View style={[$borderedArea, { flex: 1 }]}>
          <Text>Tips earned</Text>
          <Text preset="subheading">{tipAmount}</Text>
        </View>
        <View style={[$borderedArea, { flex: 1 }]}>
          <Text>Orders</Text>
          <Text preset="subheading">{numOrders}</Text>
        </View>
      </View>
      {numOrders > 0 && !!tipTopUp && (
        <View
          style={{
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: borderRadius.md,
            padding: spacing.xs,
            alignSelf: "flex-start",
            marginTop: spacing.sm,
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
    </Screen>
  );
};
