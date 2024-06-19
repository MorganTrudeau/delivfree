import {
  createStripeAccount,
  createStripeAccountLink,
  createStripeLogin,
  createStripePayment,
  getStripeAccountBalance,
  verifyStripeAccount,
} from "app/apis/stripe";
import { updateVendor } from "app/apis/vendors";
import { navigationRef } from "app/navigators";
import { Vendor } from "functions/src/types";
import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import { useToast } from "./useToast";
import Stripe from "stripe";
import { translate } from "app/i18n";

export const useStripeConnect = (vendor: Vendor) => {
  const Toast = useToast();

  const [
    {
      stripeLoginLink,
      createAccountLoading,
      balanceAvailable,
      balancePending,
      balanceCurrency,
      payoutLoading,
      openDashboardLoading,
    },
    setState,
  ] = useState<{
    stripeLoginLink: Stripe.LoginLink | null;
    createAccountLoading: boolean;
    balanceAvailable: number;
    balancePending: number;
    balanceCurrency: string;
    payoutLoading: boolean;
    openDashboardLoading: boolean;
  }>({
    stripeLoginLink: null,
    createAccountLoading: false,
    balanceAvailable: 0,
    balancePending: 0,
    balanceCurrency: "CAD",
    payoutLoading: false,
    openDashboardLoading: false,
  });

  useEffect(() => {
    if (
      typeof vendor?.stripe?.accountId === "string" &&
      vendor?.stripe?.accountId
    ) {
      verifyAccount();
    }
  }, []);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    if (
      !(
        vendor.stripe.accountId &&
        vendor.stripe.payoutsEnabled &&
        vendor.stripe.detailsSubmitted
      )
    ) {
      return;
    }
    try {
      const balance = await getStripeAccountBalance(vendor.stripe.accountId);
      console.log("STRIPE BALANCE", balance);
      setState((state) => ({
        ...state,
        balanceAvailable: balance.available[0].amount,
        balancePending: balance.pending[0].amount,
        balanceCurrency: balance.available[0].currency,
      }));
    } catch (error) {
      console.log("Failed to load balnce", error);
    }
  };

  const verifyAccount = async () => {
    try {
      const {
        isUpdated,
        stripeAccount,
        vendor: updatedVendor,
      } = await verifyStripeAccount(vendor);

      if (isUpdated) {
        await updateVendor(vendor.id, { stripe: updatedVendor.stripe });
      }

      setState((state) => ({ ...state, stripeAccount }));
    } catch (error) {
      console.log("Failed to fetch stripe account");
    }
  };

  const connectAccount = async () => {
    try {
      setState((state) => ({ ...state, createAccountLoading: true }));
      let stripeAccountId = vendor.stripe.accountId;

      if (!stripeAccountId) {
        stripeAccountId = await createStripeAccount(vendor);
      }

      const stripeAccountLink = await createStripeAccountLink(stripeAccountId);

      if (stripeAccountLink && stripeAccountLink.url) {
        const uri = stripeAccountLink.url;
        if (Platform.OS === "web") {
          window.location.href = uri;
        } else {
          Linking.openURL(uri);
          // navigationRef.current?.navigate("WebView", {
          //   uri,
          // });
        }
      } else {
        throw "missing link";
      }
      setState((state) => ({ ...state, createAccountLoading: false }));
    } catch (error) {
      console.log(error);
      setState((state) => ({ ...state, createAccountLoading: false }));
      Toast.show("Failed to connect. Try again.");
    }
  };

  const createLoginLink = async (stripeAccountId: string) => {
    const loginLink = await createStripeLogin(stripeAccountId);
    setState((state) => ({ ...state, stripeLoginLink: loginLink }));
    return loginLink;
  };

  const createPayout = async () => {
    if (!vendor.stripe.accountId) {
      return Toast.show(translate("errors.common"));
    }
    await createStripePayment(vendor.stripe.accountId);
  };

  const openDashboard = async (toAccount?: boolean) => {
    if (
      !(
        !!vendor.stripe.accountId &&
        typeof vendor.stripe.accountId === "string" &&
        vendor.stripe.detailsSubmitted
      )
    ) {
      return;
    }

    try {
      let loginLink = stripeLoginLink;
      if (!loginLink) {
        setState((s) => ({ ...s, openDashboardLoading: true }));
        loginLink = await createLoginLink(vendor.stripe.accountId);
        setState((s) => ({ ...s, openDashboardLoading: false }));
      }
      const uri = loginLink.url + (toAccount ? "#/account" : "");
      if (Platform.OS === "web") {
        window.location.href = uri;
      } else {
        Linking.openURL(uri);
        // navigationRef.current?.navigate("WebView", {
        //   uri,
        // });
      }
    } catch (error) {
      Toast.show("Failed to login. Try again.");
      setState((s) => ({ ...s, openDashboardLoading: false }));
    }
  };

  return {
    createLoginLink,
    openDashboard,
    connectAccount,
    verifyAccount,
    loadBalance,
    createAccountLoading,
    openDashboardLoading,
    balanceAvailable,
    balancePending,
    balanceCurrency,
    createPayout,
    payoutLoading,
  };
};

const getCurrencySymbol = (currency: string) => {
  const currencySymbol = new Intl.NumberFormat("en", {
    currency,
    style: "currency",
  })
    .formatToParts(0)
    .find((part) => part.type === "currency");
  return (currencySymbol && currencySymbol.value) || "$";
};
