import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import firestore from "@react-native-firebase/firestore";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "app/theme";
import { Text } from "../Text";
import { ButtonSmall } from "../ButtonSmall";
import { Icon } from "../Icon";
import { $flex, $row } from "../styles";
import { ModalRef } from "../Modal/CenterModal";
import { VendorLocationSelectModal } from "../VendorLocation/VendorLocationSelectModal";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { setDriverClockInStatus } from "app/redux/reducers/driverClockIn";
import { useAlert } from "app/hooks";

export const DriverClockIn = () => {
  const insets = useSafeAreaInsets();
  const Alert = useAlert();

  const locationSelect = useRef<ModalRef>(null);

  const dispatch = useAppDispatch();
  const driverId = useAppSelector((state) => state.driver.activeDriver?.id);
  const vendorLocations = useAppSelector((state) => state.vendorLocations.data);

  const vendorLocationsList = useMemo(
    () => Object.values(vendorLocations),
    [vendorLocations]
  );

  const clockInStatus = useAppSelector((state) => state.driverClockIn.data);

  const activeVendorLocation = clockInStatus
    ? vendorLocations[clockInStatus.vendorLocation]
    : null;

  useEffect(() => {
    const loadClockInStatus = async () => {
      if (driverId) {
        const remoteStatusDoc = await firestore()
          .collection("DriverClockIns")
          .doc(driverId)
          .get();
        const remoteStatus = remoteStatusDoc.data() as
          | {
              vendorLocation: string;
              date: number;
            }
          | undefined;
        dispatch(setDriverClockInStatus(remoteStatus || null));
      }
    };

    loadClockInStatus();
  }, [driverId]);

  const clockIn = useCallback(
    async (vendorLocation: string) => {
      locationSelect.current?.close();

      if (!driverId) {
        throw "missing-driver-id";
      }

      const driverClockInDoc = firestore()
        .collection("DriverClockIns")
        .doc(driverId);

      const newClockInStatus = { vendorLocation, date: Date.now() };
      await driverClockInDoc.set(newClockInStatus);
      dispatch(setDriverClockInStatus(newClockInStatus));
    },
    [clockInStatus, driverId]
  );
  const clockOut = useCallback(async () => {
    if (!driverId) {
      throw "missing-driver-id";
    }

    const driverClockInDoc = firestore()
      .collection("DriverClockIns")
      .doc(driverId);
    await driverClockInDoc.delete();

    dispatch(setDriverClockInStatus(null));
  }, [driverId]);

  const { exec: handleClockIn, loading: clockInLoading } =
    useAsyncFunction(clockIn);
  const { exec: handleClockout, loading: clockOutLoading } = useAsyncFunction<
    void,
    void
  >(clockOut);
  const Loading = useLoadingIndicator(clockInLoading || clockOutLoading);

  const ClockIcon = useMemo(
    () =>
      ({ style }) =>
        <Icon icon="timer-outline" color={"#fff"} style={style} />,
    []
  );

  return (
    <View
      style={[
        $row,
        {
          padding: spacing.md,
          paddingBottom: spacing.md + insets.bottom,
          backgroundColor: colors.palette.neutral800,
          justifyContent: "space-between",
        },
      ]}
    >
      <View style={[$flex, { paddingRight: spacing.sm }]}>
        <Text preset="semibold" style={{ color: colors.white, flexShrink: 1 }}>
          {clockInStatus ? "On the clock" : "Off the clock"}
        </Text>
        {!!activeVendorLocation && (
          <Text
            size={"xs"}
            style={{ color: colors.white, flexShrink: 1 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeVendorLocation.name}
          </Text>
        )}
      </View>
      <ButtonSmall
        preset={"filled"}
        LeftAccessory={ClockIcon}
        RightAccessory={Loading}
        text={clockInStatus ? "Clock out" : "Clock in"}
        onPress={() => {
          if (clockInStatus) {
            handleClockout();
          } else if (vendorLocationsList.length === 1) {
            handleClockIn(vendorLocationsList[0].id);
          } else {
            locationSelect.current?.open();
          }
        }}
      />
      <VendorLocationSelectModal
        ref={locationSelect}
        vendorLocations={vendorLocationsList}
        onPress={(location) => handleClockIn(location.id)}
      />
    </View>
  );
};
