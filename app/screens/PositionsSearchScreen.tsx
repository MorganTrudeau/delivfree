import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppStackScreenProps } from "../navigators";
import { PositionsSearchList } from "../components/Positions/PositionsSearchList";
import { spacing } from "../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Screen, Text } from "../components";
import { Pressable, View, ViewStyle } from "react-native";
import {
  $borderBottom,
  $flex,
  $flexGrow,
  $headerButton,
  $row,
  MAX_CONTENT_WIDTH,
} from "../components/styles";
import { TextInput } from "../components/TextInput";
import { ScreenHeader } from "../components/ScreenHeader";
import { useAppSelector } from "../redux/store";
import { ModalRef, Positions, VendorLocation } from "delivfree";
import { fetchPositions } from "../apis/positions";
import LocationModal from "../components/Modal/LocationModal";
import { BottomSheetRef } from "../components/Modal/BottomSheet";
import { LicenseApplicationModal } from "app/components/Licenses/LicenseApplicationModal";
import { LicenseItem } from "app/components/Licenses/LicenseItem";
import { sizing } from "app/theme/sizing";
import { StatusIndicator } from "app/components/StatusIndicator";

interface Props extends AppStackScreenProps<"PositionsSearch"> {}

export const PositionsSearchScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  const locationModal = useRef<BottomSheetRef>(null);
  const licenseApplicationModal = useRef<ModalRef>(null);

  const user = useAppSelector((state) => state.user.user);
  const driver = useAppSelector((state) => state.driver.activeDriver);

  const userLatitude = user?.location?.latitude;
  const userLongitude = user?.location?.longitude;
  const userAddress = user?.location?.address;
  const driverLicenses = driver?.licenses;
  const registrationStatus = driver?.registration.status;

  useEffect(() => {
    navigation.setOptions({
      headerRight: registrationStatus
        ? () => (
            <View style={[$row, $headerButton]}>
              <Pressable
                style={$row}
                onPress={() => navigation.navigate("DriverRegistration")}
              >
                <StatusIndicator
                  status={registrationStatus}
                  style={{ marginRight: spacing.sm, alignSelf: "center" }}
                />
                <Icon icon="account-circle" size={sizing.xxl} />
              </Pressable>

              <Pressable
                style={{ marginLeft: spacing.md }}
                onPress={() => navigation.navigate("Settings")}
              >
                <Icon icon="settings" />
              </Pressable>
            </View>
          )
        : undefined,
    });
  }, [registrationStatus]);

  const [positions, setPositions] = useState<Positions[]>([]);
  const [applyState, setApplyState] = useState<{
    positions: Positions | null;
    vendorLocation: VendorLocation | null;
  }>({ positions: null, vendorLocation: null });

  const loadPositions = useCallback(async () => {
    try {
      const _positions = await fetchPositions({
        status: "approved",
        hasOpenings: true,
        latitude: userLatitude,
        longitude: userLongitude,
      });
      setPositions(_positions);
    } catch (error) {
      console.log("Failed to load positions", error);
    }
  }, [userLatitude, userLongitude]);

  const handleApply = useCallback(
    (positions: Positions, vendorLocation: VendorLocation) => {
      setApplyState({ vendorLocation, positions });
      licenseApplicationModal.current?.open();
    },
    []
  );

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  const listContent = useMemo(
    () => ({
      paddingTop: spacing.md,
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.sm + insets.bottom,
      flexGrow: 1,
    }),
    [insets.bottom]
  );

  const renderHeader = useCallback(() => {
    return (
      <View
        style={{ paddingBottom: spacing.lg, paddingHorizontal: spacing.sm }}
      >
        <ScreenHeader title={"Open positions"} />
        <LicenseApplications />
        {!!userAddress && (
          <Pressable
            style={$location}
            onPress={() => {
              locationModal.current?.snapToIndex(0);
            }}
          >
            <Text>{userAddress}</Text>
            <Icon icon={"chevron-down"} />
          </Pressable>
        )}
        {/* <TextInput placeholder="Search" /> */}
      </View>
    );
  }, [userAddress]);

  return (
    <Screen style={$screen} contentContainerStyle={$flexGrow} preset="fixed">
      <View style={$contentWrapper}>
        <PositionsSearchList
          positions={positions}
          contentContainerStyle={listContent}
          style={$flex}
          ListHeaderComponent={renderHeader}
          onApply={handleApply}
          licenses={driverLicenses}
        />
      </View>
      <LocationModal
        ref={locationModal}
        onRequestClose={() => locationModal.current?.close()}
      />
      <LicenseApplicationModal
        ref={licenseApplicationModal}
        positions={applyState.positions}
        vendorLocation={applyState.vendorLocation}
        driver={driver?.id}
        onSuccess={(updatedPosition) => {
          setPositions((positions) =>
            positions.map((p) =>
              p.id === updatedPosition.id ? updatedPosition : p
            )
          );
          licenseApplicationModal.current?.close();
        }}
      />
    </Screen>
  );
};

const LicenseApplications = () => {
  const driver = useAppSelector((state) => state.driver.activeDriver);
  const licenseIds = driver?.licenses;
  if (!licenseIds?.length) {
    return null;
  }
  return (
    <View
      style={[
        $borderBottom,
        { paddingBottom: spacing.md, marginBottom: spacing.md },
      ]}
    >
      <Text preset="subheading" style={{ marginBottom: spacing.xxs }}>
        License applications
      </Text>
      <View
        style={[
          $row,
          { flexWrap: "wrap", rowGap: spacing.sm, columnGap: spacing.sm },
        ]}
      >
        {licenseIds.map((id) => (
          <LicenseItem key={id} licenseId={id} />
        ))}
      </View>
    </View>
  );
};

const $screen: ViewStyle = { flex: 1 };
const $contentWrapper: ViewStyle = {
  flex: 1,
  maxWidth: MAX_CONTENT_WIDTH,
  alignSelf: "center",
  width: "100%",
};
const $location: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing.sm,
};
