import React, { useMemo } from "react";
import { useAppSelector } from "app/redux/store";
import { isUserRegistered } from "app/utils/user";
import { getStackNavigator, screenOptions } from "../StackNavigator";
import { renderAuthStack } from "../AuthStack";
import { renderRegistrationStack } from "../RegistrationStack";
import * as Screens from "app/screens";
import { LogoHeader } from "app/components/LogoHeader";
import { getPositionsFromSubscription } from "app/utils/subscriptions";
import { getTotalPositions } from "app/utils/positions";

const Stack = getStackNavigator();

export const VendorStack = () => {
  const {
    user,
    vendor,
    vendorLoaded,
    driver,
    driverLoaded,
    authToken,
    userLoaded,
    deleteAccountLoading,
    vendorSubscription,
    vendorSubscriptionLoaded,
    driverSubscription,
    driverSubscriptionLoaded,
    userType,
    vendorLicenses,
    vendorLicensesLoaded,
    driverLicenses,
    driverLicensesLoaded,
  } = useAppSelector((state) => ({
    user: state.user.user,
    userLoaded: state.user.loaded,
    authToken: state.auth.authToken,
    deleteAccountLoading: state.user.deleteAccountLoading,
    vendor: state.vendor.activeVendor,
    vendorLoaded: state.vendor.licencesLoaded,
    driver: state.driver.activeDriver,
    driverLoaded: state.driver.activeDriverLoaded,
    vendorSubscription: state.subscription.vendorSubscription,
    vendorSubscriptionLoaded: state.subscription.vendorSubscriptionLoaded,
    driverSubscription: state.subscription.driverSubscription,
    driverSubscriptionLoaded: state.subscription.driverSubscriptionLoaded,
    userType: state.appConfig.userType,
    vendorLicenses: state.vendor.licenses,
    vendorLicensesLoaded: state.vendor.licencesLoaded,
    driverLicenses: state.driver.licenses,
    driverLicensesLoaded: state.driver.licensesLoaded,
  }));

  const driverDataLoaded =
    driverLoaded && driverLicensesLoaded && driverSubscriptionLoaded;
  const vendorDataLoaded =
    vendorLoaded && vendorLicensesLoaded && vendorSubscriptionLoaded;

  const approvedLicenses = useMemo(() => {
    return Object.values(
      userType === "vendor" ? vendorLicenses : driverLicenses
    ).filter((l) => l.status === "approved");
  }, [vendorLicenses, driverLicenses, userType]);

  const subscriptionValid = useMemo(() => {
    const subscription =
      userType === "driver" ? driverSubscription : vendorSubscription;

    if (userType === "vendor" && !approvedLicenses.length) {
      return true;
    }

    if (!approvedLicenses.length || !subscription) {
      return false;
    }

    const { fullTime: licensedFullTime, partTime: licensedPartTime } =
      getTotalPositions(approvedLicenses);
    const { fullTime: subscribedFullTime, partTime: subscribedPartTime } =
      getPositionsFromSubscription(subscription);

    console.log({
      licensedFullTime,
      licensedPartTime,
      subscribedFullTime,
      subscribedPartTime,
    });

    return (
      ["active", "incomplete", "trialing"].includes(subscription.status) &&
      licensedFullTime === subscribedFullTime &&
      licensedPartTime === subscribedPartTime
    );
  }, [approvedLicenses, vendorSubscription, driverSubscription, userType]);

  const renderDriverStack = () => {
    if (!driverDataLoaded) {
      return <Stack.Screen name="Loading" component={Screens.LoadingScreen} />;
    }

    if (!driver) {
      return renderRegistrationStack({ user });
    }

    if (driver.registration.status !== "approved" || !approvedLicenses.length) {
      return (
        <>
          <Stack.Screen
            name="PositionsSearch"
            component={Screens.PositionsSearchScreen}
            options={{
              headerShown: true,
              headerTransparent: false,
              headerTitle: LogoHeader,
            }}
          />
          <Stack.Screen
            name="DriverRegistration"
            component={Screens.EditDriverProfileScreen}
            options={{
              headerShown: true,
              headerTransparent: false,
              headerTitle: LogoHeader,
            }}
          />
          <Stack.Screen
            name="AddressSearch"
            component={Screens.AddressSearchScreen}
            options={{
              headerShown: true,
              headerTransparent: false,
              headerTitle: LogoHeader,
            }}
          />
        </>
      );
    }

    if (!subscriptionValid) {
      return (
        <Stack.Screen
          name="StartSubscription"
          component={Screens.DriverStartSubscriptionScreen}
        />
      );
    }

    return (
      <>
        <Stack.Screen name="Orders" component={Screens.DriverOrdersScreen} />
        <Stack.Screen name="Profile" component={Screens.DriverProfileScreen} />
        <Stack.Screen
          name="AddressSearch"
          component={Screens.AddressSearchScreen}
        />
        <Stack.Screen
          name="Subscription"
          component={Screens.DriverSubscriptionScreen}
        />
        <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
        <Stack.Screen name="About" component={Screens.AboutScreen} />
        <Stack.Screen
          name="DeleteAccount"
          component={Screens.DeleteAccountScreen}
        />
      </>
    );
  };

  const renderVendorStack = () => {
    if (!vendorDataLoaded) {
      return <Stack.Screen name="Loading" component={Screens.LoadingScreen} />;
    }

    if (!vendor) {
      return renderRegistrationStack({ user });
    }

    if (vendor.registration.status !== "approved") {
      return (
        <Stack.Screen
          name="VendorRegistration"
          component={Screens.EditVendorProfileScreen}
          options={{
            headerShown: true,
            headerTransparent: false,
            headerTitle: LogoHeader,
          }}
        />
      );
    }

    if (!subscriptionValid) {
      return (
        <Stack.Screen
          name="StartSubscription"
          component={Screens.VendorStartSubscriptionScreen}
        />
      );
    }

    return (
      <>
        <Stack.Screen name="Home" component={Screens.VendorHomeScreen} />
        <Stack.Screen name="Orders" component={Screens.VendorOrdersScreen} />
        <Stack.Screen name="Profile" component={Screens.VendorProfileScreen} />
        <Stack.Screen
          name="Locations"
          component={Screens.VendorLocationsScreen}
        />
        <Stack.Screen
          name="Subscription"
          component={Screens.VendorSubscriptionScreen}
        />
        <Stack.Screen
          name="Positions"
          component={Screens.VendorPositionsScreen}
        />
        <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
        <Stack.Screen name="About" component={Screens.AboutScreen} />
        <Stack.Screen
          name="DeleteAccount"
          component={Screens.DeleteAccountScreen}
        />
      </>
    );
  };

  const renderStack = () => {
    if (!(authToken && userLoaded)) {
      return renderAuthStack();
    }

    if (!(isUserRegistered(user) || deleteAccountLoading)) {
      return renderRegistrationStack({ user });
    }

    if (userType === "driver") {
      return renderDriverStack();
    } else if (userType === "vendor") {
      return renderVendorStack();
    } else {
      return <Stack.Screen name="Loading" component={Screens.LoadingScreen} />;
    }
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {renderStack()}
    </Stack.Navigator>
  );
};
