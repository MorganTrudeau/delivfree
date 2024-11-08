import { deleteDriver, updateDriver } from "app/apis/driver";
import { listenToLicenses } from "app/apis/licenses";
import { fetchSubscription } from "app/apis/stripe";
import { Icon, Screen, Text } from "app/components";
import { DetailItem } from "app/components/DetailItem";
import { DetailsHeader } from "app/components/Details/DetailsHeader";
import { EmptyList } from "app/components/EmptyList";
import { LicenseDisplayModal } from "app/components/Licenses/LicenseDisplayModal";
import { LicensesList } from "app/components/Licenses/LicensesList";
import { ModalRef } from "app/utils/types";
import { StatusPicker } from "app/components/StatusPicker";
import { ScreenHeader } from "app/components/ScreenHeader";
import { SubscriptionInfo } from "app/components/Subscription/SubscriptionInfo";
import {
  $borderedArea,
  $containerPadding,
  $formLabel,
  $row,
  $screen,
} from "app/components/styles";
import { useReduxListener } from "app/hooks/useReduxListener";
import { AppStackScreenProps } from "app/navigators";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { listenToDriver } from "app/redux/thunks/driver";
import { colors, spacing } from "app/theme";
import { Driver, License, Status } from "delivfree";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Linking, Pressable, ViewStyle } from "react-native";
import Stripe from "stripe";
import { viewSubscriptionOnStripe } from "app/utils/subscriptions";
import { DriversLicenseUpload } from "app/components/DriversLicenseUpload";
import { listenToVendorLocations } from "app/redux/thunks/vendorLocations";
import { useAlert } from "app/hooks";
import { ButtonSmall } from "app/components/ButtonSmall";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { confirmDelete } from "app/utils/general";

interface DriverDetailScreenProps extends AppStackScreenProps<"DriverDetail"> {}

export const DriverDetailScreen = (props: DriverDetailScreenProps) => {
  const Alert = useAlert();

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

  const downloadCriminalRecordCheck = async () => {
    try {
      if (!driver.criminalRecordCheck) {
        return;
      }
      Linking.openURL(driver.criminalRecordCheck);
    } catch (error) {
      console.log(error);
      Alert.alert("Download failed", "Please try that again.");
    }
  };

  const handleDeleteDriver = useCallback(async () => {
    try {
      const shouldDelete = await confirmDelete(Alert);
      if (!shouldDelete) {
        return;
      }
      await deleteDriver(driverId);
      props.navigation.navigate("Drivers");
    } catch (error) {
      console.log("Failed to delete driver", error);
    Alert.alert(
        "Something went wrong",
        "Failed to delete driver. Please try again."
      );
    }
  }, [driverId]);

  const { loading: deleteLoading, exec: execDeleteDriver } =
    useAsyncFunction(handleDeleteDriver);

  const DeleteLoading = useLoadingIndicator(deleteLoading, {
    color: colors.primary,
  });

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
        userId={driver.user}
        titleProps={{
          style: { marginTop: spacing.xxs, marginBottom: 2 },
          preset: "semibold",
          size: "xs",
        }}
      />
      <>
        <Text
          preset="semibold"
          size={"xs"}
          style={{ marginTop: spacing.xxs, marginBottom: 2 }}
        >
          Criminal record check
        </Text>
        <Pressable
          style={[$row, $borderedArea, { alignSelf: "flex-start" }]}
          onPress={downloadCriminalRecordCheck}
        >
          <Icon
            icon={
              driver.criminalRecordCheck
                ? "file-check-outline"
                : "file-remove-outline"
            }
          />
          <Text style={{ marginLeft: spacing.sm }}>
            {driver.criminalRecordCheck ? "File uploaded" : "File missing"}
          </Text>
        </Pressable>
      </>

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

      <ButtonSmall
        text="Delete Driver"
        style={{
          marginTop: spacing.xl,
          alignSelf: "center",
          width: "100%",
          maxWidth: 300,
        }}
        textStyle={{ color: colors.primary }}
        RightAccessory={DeleteLoading}
        onPress={execDeleteDriver}
      />
    </Screen>
  );
};

const $listHeaderStyle: ViewStyle = { borderTopWidth: 0 };
const $detailHeaderStyle: ViewStyle = { marginTop: spacing.xl };
