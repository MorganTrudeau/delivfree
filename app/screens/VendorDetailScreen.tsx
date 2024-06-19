import { listenToLicenses } from "app/apis/licenses";
import { listenToPositions } from "app/apis/positions";
import { fetchSubscription } from "app/apis/stripe";
import { updateVendor } from "app/apis/vendors";
import { Screen, Text } from "app/components";
import { DetailItem } from "app/components/DetailItem";
import { DetailsHeader } from "app/components/Details/DetailsHeader";
import { Drawer } from "app/components/Drawer";
import { EmptyList } from "app/components/EmptyList";
import { LicenseDisplayModal } from "app/components/Licenses/LicenseDisplayModal";
import { LicensesList } from "app/components/Licenses/LicensesList";
import { PositionsList } from "app/components/Positions/PositionsList";
import { PositionsSelectModal } from "app/components/Positions/PositionsSelectModal";
import { StatusPicker } from "app/components/StatusPicker";
import { ManageVendorLocationModal } from "app/components/VendorLocation/ManageVendorLocation";
import { ScreenHeader } from "app/components/ScreenHeader";
import { SubscriptionInfo } from "app/components/Subscription/SubscriptionInfo";
import { VendorLocationsList } from "app/components/VendorLocations/VendorLocationsList";
import { $containerPadding, $screen } from "app/components/styles";
import { useReduxListener } from "app/hooks/useReduxListener";
import { AppStackScreenProps } from "app/navigators";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { listenToVendorLocations } from "app/redux/thunks/vendorLocations";
import { listenToVendor } from "app/redux/thunks/vendor";
import { colors, spacing } from "app/theme";
import {
  License,
  ModalRef,
  Positions,
  Status,
  Vendor,
  VendorLocation,
} from "delivfree";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Linking, ViewStyle } from "react-native";
import Stripe from "stripe";
import { viewSubscriptionOnStripe } from "app/utils/subscriptions";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";

interface VendorDetailScreenProps extends AppStackScreenProps<"VendorDetail"> {}

export const VendorDetailScreen = (props: VendorDetailScreenProps) => {
  const vendorId = props.route.params?.vendor;

  const vendorLocationModal = useRef<BottomSheetRef>(null);
  const positionsModal = useRef<ModalRef>(null);
  const licenseDisplayModal = useRef<ModalRef>(null);

  const openVendorLocationModal = useCallback(() => {
    vendorLocationModal.current?.snapToIndex(0);
  }, []);
  const closeVendorLocationModal = useCallback(() => {
    vendorLocationModal.current?.close();
  }, []);

  const vendors = useAppSelector((state) => state.vendor.data);
  const vendorLocationsCache = useAppSelector(
    (state) => state.vendorLocations.data
  );
  const vendorLocations = useMemo(
    () =>
      Object.values(vendorLocationsCache).filter((l) => l.vendor === vendorId),
    [vendorId, vendorLocationsCache]
  );

  const vendorListener = useCallback(() => {
    return dispatch(listenToVendor(vendorId));
  }, []);
  const vendorLocationsListener = useCallback(() => {
    return dispatch(listenToVendorLocations({ vendor: vendorId }));
  }, [vendorId]);

  useReduxListener(vendorListener);
  useReduxListener(vendorLocationsListener);

  const vendor: Vendor | undefined = vendors[vendorId];

  const dispatch = useAppDispatch();

  const [positions, setPositions] = useState<Positions[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [editPositions, setEditPositions] = useState<Positions>();
  const [subscription, setSubscription] = useState<Stripe.Subscription>();
  const [editLocation, setEditLocation] = useState<VendorLocation>();
  const [licenseDisplay, setLicenseDisplay] = useState<License>();

  const handleLicensePress = (license: License) => {
    setLicenseDisplay(license);
    licenseDisplayModal.current?.open();
  };

  const handleLicenseDisplayChange = (
    licenseId: string,
    update: Partial<License>
  ) => {
    setLicenseDisplay((l) => (l ? { ...l, ...update } : l));
  };

  const addLocation = () => {
    openVendorLocationModal();
  };

  const handlePositionsPress = (positions: Positions) => {
    setEditPositions(positions);
    positionsModal.current?.open();
  };

  const closePositionsModal = () => {
    positionsModal.current?.close();
  };

  const handleVendorLocationPress = (vendorLocation: VendorLocation) => {
    setEditLocation(vendorLocation);
    vendorLocationModal.current?.snapToIndex(0);
  };

  useEffect(() => {
    const load = async () => {
      const sub = await fetchSubscription(vendorId);
      setSubscription(sub);
    };
    load();
  }, []);

  useEffect(() => {
    return listenToLicenses(
      (licensesData) => {
        setLicenses(Object.values(licensesData));
      },
      { vendor: vendorId }
    );
  }, [vendorId]);

  useEffect(() => {
    return listenToPositions(
      (positionsData) => {
        console.log(positionsData);
        setPositions(Object.values(positionsData));
      },
      { vendor: vendorId }
    );
  }, [vendorId]);

  const handleRegistrationStatusChange = async (
    status: Status,
    message: string | null
  ) => {
    try {
      await updateVendor(vendorId, { registration: { status, message } });
    } catch (error) {
      console.log("Failed to change registration status", error);
    }
  };

  const handleViewSubscription = async () => {
    if (!subscription) {
      return;
    }
    await viewSubscriptionOnStripe(subscription);
  };

  if (!vendor) {
    return (
      <Screen
        preset="scroll"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <ActivityIndicator
          color={colors.primary}
          style={{ margin: spacing.lg }}
        />
      </Screen>
    );
  }

  return (
    <Screen
      preset="scroll"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <ScreenHeader title={vendor.businessName} />

      <Text preset={"semibold"} size={"xs"} style={{ marginBottom: 6 }}>
        Account status
      </Text>
      <StatusPicker
        status={vendor.registration.status}
        onPress={handleRegistrationStatusChange}
        style={{ marginBottom: spacing.md }}
      />

      <DetailsHeader title={"Details"} />
      <DetailItem title="Business name" value={vendor.businessName} />
      <DetailItem title="First name" value={vendor.firstName} />
      <DetailItem title="Last name" value={vendor.lastName} />
      <DetailItem
        title="Phone number"
        value={vendor.callingCode + " " + vendor.phoneNumber}
      />

      <DetailsHeader title={"Subscription"} style={$detailHeaderStyle} />
      {subscription ? (
        <SubscriptionInfo
          subscription={subscription}
          onPress={handleViewSubscription}
        />
      ) : (
        <EmptyList title={"No subscription"} />
      )}

      <DetailsHeader
        title={"Locations"}
        style={$detailHeaderStyle}
        onAction={addLocation}
        actionIcon="plus"
      />
      <VendorLocationsList
        locations={vendorLocations}
        headerStyle={$listHeaderStyle}
        style={{ flexGrow: 0 }}
        onPress={handleVendorLocationPress}
      />

      <DetailsHeader title={"Positions"} style={$detailHeaderStyle} />
      <PositionsList
        positions={positions}
        vendorLocations={vendorLocationsCache}
        headerStyle={$listHeaderStyle}
        onPress={handlePositionsPress}
        style={{ flexGrow: 0 }}
      />

      <DetailsHeader title={"Licenses"} style={$detailHeaderStyle} />
      <LicensesList
        licenses={licenses}
        vendorLocations={vendorLocationsCache}
        headerStyle={$listHeaderStyle}
        onPress={handleLicensePress}
        style={{ flexGrow: 0 }}
        showDriver
      />

      <LicenseDisplayModal
        ref={licenseDisplayModal}
        license={licenseDisplay}
        onChange={handleLicenseDisplayChange}
        editable={false}
      />

      <ManageVendorLocationModal
        vendor={vendorId}
        ref={vendorLocationModal}
        onClose={closeVendorLocationModal}
        editLocation={editLocation}
      />

      <PositionsSelectModal
        ref={positionsModal}
        positions={editPositions}
        onClose={closePositionsModal}
      />
    </Screen>
  );
};

const $listHeaderStyle: ViewStyle = { borderTopWidth: 0 };
const $detailHeaderStyle: ViewStyle = { marginTop: spacing.xl };
