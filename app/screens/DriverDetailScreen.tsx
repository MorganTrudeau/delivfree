import { updateDriver } from "app/apis/driver";
import { listenToLicenses } from "app/apis/licenses";
import { fetchSubscription } from "app/apis/stripe";
import { Screen, Text } from "app/components";
import { DetailItem } from "app/components/DetailItem";
import { DetailsHeader } from "app/components/Details/DetailsHeader";
import { Drawer } from "app/components/Drawer";
import { EmptyList } from "app/components/EmptyList";
import { LicenseDisplayModal } from "app/components/Licenses/LicenseDisplayModal";
import { LicensesList } from "app/components/Licenses/LicensesList";
import { ModalRef } from "app/components/Modal/CenterModal";
import { StatusPicker } from "app/components/StatusPicker";
import { ScreenHeader } from "app/components/ScreenHeader";
import { SubscriptionInfo } from "app/components/Subscription/SubscriptionInfo";
import { $containerPadding, $screen } from "app/components/styles";
import { useReduxListener } from "app/hooks/useReduxListener";
import { AppStackScreenProps } from "app/navigators";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { listenToDriver } from "app/redux/thunks/driver";
import { colors, spacing } from "app/theme";
import { Driver, License, Status } from "delivfree";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ViewStyle } from "react-native";
import Stripe from "stripe";
import { viewSubscriptionOnStripe } from "app/utils/subscriptions";
import { DriversLicenseUpload } from "app/components/DriversLicenseUpload";
import { listenToVendorLocations } from "app/redux/thunks/vendorLocations";

interface DriverDetailScreenProps extends AppStackScreenProps<"DriverDetail"> {}

export const DriverDetailScreen = (props: DriverDetailScreenProps) => {
  const driverId = props.route.params?.driver;

  const licenseDisplayModal = useRef<ModalRef>(null);

  const drivers = useAppSelector((state) => state.driver.data);

  const driver: Driver | undefined = drivers[driverId];

  const vendorLocations = useAppSelector((state) => state.vendorLocations.data);
  const dispatch = useAppDispatch();

  const [subscription, setSubscription] = useState<Stripe.Subscription>();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [licenseDisplay, setLicenseDisplay] = useState<License>();

  const driverListener = useCallback(() => {
    return dispatch(listenToDriver(driverId));
  }, []);
  useReduxListener(driverListener);

  const vendorLocationsListener = useCallback(() => {
    const locations = licenses.map((l) => l.vendorLocation);
    return dispatch(listenToVendorLocations({ id: locations }));
  }, [licenses]);
  useReduxListener(vendorLocationsListener);

  useEffect(() => {
    const load = async () => {
      const sub = await fetchSubscription(driverId);
      setSubscription(sub);
    };
    load();
  }, []);

  useEffect(() => {
    return listenToLicenses(
      (licensesData) => {
        setLicenses(Object.values(licensesData));
      },
      { driver: driverId }
    );
  }, []);

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

  const handleRegistrationStatusChange = async (
    status: Status,
    message: string | null
  ) => {
    try {
      await updateDriver(driverId, { registration: { status, message } });
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

  if (!driver) {
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
      <ScreenHeader title={driver.firstName + " " + driver.lastName} />

      <Text preset={"semibold"} size={"xs"} style={{ marginBottom: 6 }}>
        Account status
      </Text>
      <StatusPicker
        status={driver.registration.status}
        onPress={handleRegistrationStatusChange}
        style={{ marginBottom: spacing.md }}
      />

      <DetailsHeader title={"Details"} />
      <DetailItem title="First name" value={driver.firstName} />
      <DetailItem title="Last name" value={driver.lastName} />
      <DetailItem title="Email" value={driver.email} />
      <DetailItem
        title="Phone number"
        value={driver.callingCode + " " + driver.phoneNumber}
      />
      <DriversLicenseUpload
        frontImage={driver.driversLicenseFront}
        backImage={driver.driversLicenseBack}
        viewOnly
        driverId={driverId}
        titleProps={{
          style: { marginTop: spacing.xxs, marginBottom: 2 },
          preset: "semibold",
          size: "xs",
        }}
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

      <DetailsHeader title={"Licenses"} style={$detailHeaderStyle} />
      <LicensesList
        licenses={licenses}
        vendorLocations={vendorLocations}
        headerStyle={$listHeaderStyle}
        onPress={handleLicensePress}
        style={{ flexGrow: 0 }}
      />
      <LicenseDisplayModal
        ref={licenseDisplayModal}
        license={licenseDisplay}
        onChange={handleLicenseDisplayChange}
        editable={false}
      />
    </Screen>
  );
};

const $listHeaderStyle: ViewStyle = { borderTopWidth: 0 };
const $detailHeaderStyle: ViewStyle = { marginTop: spacing.xl };
