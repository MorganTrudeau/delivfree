import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "app/redux/store";
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
import { getTotalPositions } from "app/utils/positions";
import { getPositionsFromSubscription } from "app/utils/subscriptions";

export const DriverClockIn = () => {
  const { driverSubscription, driverLicenses, driver } = useAppSelector(
    (state) => ({
      driver: state.driver.activeDriver,
      driverSubscription: state.subscription.driverSubscription,
      driverLicenses: state.driver.licenses,
    })
  );

  const approvedLicenses = useMemo(() => {
    return Object.values(driverLicenses).filter((l) => l.status === "approved");
  }, [driverLicenses]);

  const subscriptionValid = useMemo(() => {
    const subscription = driverSubscription;

    if (!approvedLicenses.length || !subscription) {
      return false;
    }

    const { fullTime: licensedFullTime, partTime: licensedPartTime } =
      getTotalPositions(approvedLicenses);
    const { fullTime: subscribedFullTime, partTime: subscribedPartTime } =
      getPositionsFromSubscription(subscription);

    return (
      ["active", "incomplete", "trialing"].includes(subscription.status) &&
      licensedFullTime === subscribedFullTime &&
      licensedPartTime === subscribedPartTime
    );
  }, [approvedLicenses, driverSubscription]);

  const insets = useSafeAreaInsets();

  const locationSelect = useRef<ModalRef>(null);

  const driverId = useAppSelector((state) => state.driver.activeDriver?.id);
  const vendorLocations = useAppSelector((state) => state.vendorLocations.data);
  const vendorLocationsList = useMemo(
    () => Object.values(vendorLocations),
    [vendorLocations]
  );

  const [clockInStatus, setClockInStatus] = useState("out");

  useEffect(() => {
    const loadClockInStatus = async () => {
      const savedStatus = await getSavedClockInStatus();
      if (savedStatus) {
        setClockInStatus(savedStatus);
      }
      if (driverId) {
        const remoteStatusDoc = await firestore()
          .collection("DriverClockIns")
          .doc(driverId)
          .get();
        if (remoteStatusDoc.data()) {
          setClockInStatus("in");
        }
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

      const newClockInStatus = clockInStatus === "in" ? "out" : "in";

      await driverClockInDoc.set({ vendorLocation, date: Date.now() });

      setClockInStatus(newClockInStatus);
      saveClockInStatus(newClockInStatus);
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

    const newClockInStatus = clockInStatus === "in" ? "out" : "in";

    setClockInStatus(newClockInStatus);
    saveClockInStatus(newClockInStatus);
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

  if (
    !(
      subscriptionValid &&
      approvedLicenses.length &&
      driver?.registration.status === "approved"
    )
  ) {
    return null;
  }

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
      <Text preset="semibold" style={{ color: colors.white }}>
        {clockInStatus === "in" ? "On the clock" : "Clock in to accept orders"}
      </Text>
      <ButtonSmall
        preset={"filled"}
        LeftAccessory={ClockIcon}
        RightAccessory={Loading}
        text={clockInStatus === "in" ? "Clock out" : "Clock in"}
        onPress={() => {
          if (clockInStatus === "in") {
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

const getSavedClockInStatus = () => {
  return AsyncStorage.getItem("CLOCK_IN_STATUS");
};

const saveClockInStatus = (status: "in" | "out") => {
  try {
    return AsyncStorage.setItem("CLOCK_IN_STATUS", status);
  } catch (error) {
    console.log("Failed to save clock in status", error);
    return null;
  }
};
