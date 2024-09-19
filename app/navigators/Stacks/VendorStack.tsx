import React, { useMemo } from "react";
import { useAppSelector } from "app/redux/store";
import { isUserRegistered } from "app/utils/user";
import { getStackNavigator, screenOptions } from "../StackNavigator";
import { renderAuthStack } from "../AuthStack";
import { renderRegistrationStack } from "../RegistrationStack";
import * as Screens from "app/screens";
import { DrawerIconButton } from "app/components/DrawerIconButton";
import { LogoHeader } from "app/components/LogoHeader";
import { shallowEqual } from "react-redux";
import { Platform } from "react-native";
import { selectSubscriptionValid } from "app/redux/selectors";

const isWeb = Platform.OS === "web";

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
    vendorSubscriptionLoaded,
    driverSubscriptionLoaded,
    userType,
    vendorLicenses,
    vendorLicensesLoaded,
    driverLicenses,
    driverLicensesLoaded,
    subscriptionValid,
  } = useAppSelector(
    (state) => ({
      subscriptionValid: selectSubscriptionValid(state),
      user: state.user.user,
      userLoaded: state.user.loaded,
      authToken: state.auth.authToken,
      deleteAccountLoading: state.user.deleteAccountLoading,
      vendor: state.vendor.activeVendor,
      vendorLoaded: state.vendor.licencesLoaded,
      driver: state.driver.activeDriver,
      driverLoaded: state.driver.activeDriverLoaded,
      vendorSubscriptionLoaded: state.subscription.vendorSubscriptionLoaded,
      driverSubscriptionLoaded: state.subscription.driverSubscriptionLoaded,
      userType: state.appConfig.userType,
      vendorLicenses: state.vendor.licenses,
      vendorLicensesLoaded: state.vendor.licencesLoaded,
      driverLicenses: state.driver.licenses,
      driverLicensesLoaded: state.driver.licensesLoaded,
    }),
    shallowEqual
  );

  const driverDataLoaded =
    driverLoaded && driverLicensesLoaded && driverSubscriptionLoaded;
  const vendorDataLoaded =
    vendorLoaded && vendorLicensesLoaded && vendorSubscriptionLoaded;

  const approvedLicenses = useMemo(() => {
    return Object.values(
      userType === "vendor" ? vendorLicenses : driverLicenses
    ).filter((l) => l.status === "approved");
  }, [vendorLicenses, driverLicenses, userType]);

  const renderDriverStack = () => {
    if (!driverDataLoaded) {
      return (
        <Stack.Screen
          name="Loading"
          component={Screens.LoadingScreen}
          options={{
            headerShown: false,
          }}
        />
      );
    }

    if (!driver) {
      return renderRegistrationStack({ user });
    }

    if (
      user?.driver?.parentDriver &&
      (!approvedLicenses.length ||
        !subscriptionValid ||
        driver.registration.status !== "approved")
    ) {
      return (
        <Stack.Screen
          name="DriverRegistration"
          component={Screens.EditDriverProfileScreen}
        />
      );
    }

    if (driver.registration.status !== "approved" || !approvedLicenses.length) {
      return (
        <>
          <Stack.Screen
            name="PositionsSearch"
            component={Screens.PositionsSearchScreen}
            options={{
              headerTitle: "",
              headerLeft: () => <LogoHeader />,
            }}
          />
          <Stack.Screen
            name="DriverRegistration"
            component={Screens.EditDriverProfileScreen}
          />
          <Stack.Screen
            name="AddressSearch"
            component={Screens.AddressSearchScreen}
            options={{ headerRight: undefined }}
          />
          <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
        </>
      );
    }

    if (!subscriptionValid && isWeb) {
      return (
        <>
          <Stack.Screen
            name="StartSubscription"
            component={Screens.DriverStartSubscriptionScreen}
          />
          <Stack.Screen name="Payment" component={Screens.PaymentScreen} />
        </>
      );
    }

    return (
      <>
        <Stack.Screen
          name="Orders"
          component={Screens.DriverOrdersScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Tips"
          component={Screens.DriverTipsScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Screens.DriverProfileScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Subscription"
          component={Screens.DriverSubscriptionScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Screens.SettingsScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="AddressSearch"
          component={Screens.AddressSearchScreen}
          options={{ headerRight: undefined }}
        />
      </>
    );
  };

  const renderVendorStack = () => {
    if (!vendorDataLoaded) {
      return (
        <Stack.Screen
          name="Loading"
          component={Screens.LoadingScreen}
          options={{
            headerShown: false,
          }}
        />
      );
    }

    if (!vendor) {
      return renderRegistrationStack({ user });
    }

    if (vendor.registration.status !== "approved") {
      return (
        <Stack.Screen
          name="VendorRegistration"
          component={Screens.EditVendorProfileScreen}
        />
      );
    }

    if (!subscriptionValid && isWeb) {
      return (
        <>
          <Stack.Screen
            name="StartSubscription"
            component={Screens.VendorStartSubscriptionScreen}
          />
          <Stack.Screen name="Payment" component={Screens.PaymentScreen} />
        </>
      );
    }

    return (
      <>
        <Stack.Screen
          name="Home"
          component={Screens.VendorHomeScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Menus"
          component={Screens.VendorMenusScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Orders"
          component={Screens.VendorOrdersScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Tips"
          component={Screens.VendorTipsScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Screens.VendorProfileScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Locations"
          component={Screens.VendorLocationsScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Subscription"
          component={Screens.VendorSubscriptionScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Positions"
          component={Screens.VendorPositionsScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Screens.SettingsScreen}
          options={{ headerLeft: DrawerIconButton, headerBackVisible: false }}
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
      <Stack.Screen
        name="VendorTermsAndConditions"
        component={Screens.VendorTermsScreen}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={Screens.PrivacyPolicyScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        component={Screens.ForgotPasswordScreen}
        options={{
          headerRight: () => null,
        }}
      />
      <Stack.Screen name="About" component={Screens.AboutScreen} />
      <Stack.Screen
        name="DeleteAccount"
        component={Screens.DeleteAccountScreen}
      />
      <Stack.Screen name="WebView" component={Screens.WebViewScreen} />
    </Stack.Navigator>
  );
};
