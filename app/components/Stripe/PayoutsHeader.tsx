import React from "react";
import { Vendor } from "delivfree";
import {
  ActivityIndicator,
  Image,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../Text";
import { $borderedArea, $flex, $row } from "../styles";
import { useStripeConnect } from "app/hooks/useStripeConnect";
import { ButtonSmall } from "../ButtonSmall";
import { colors, spacing } from "app/theme";
import { localizeCurrency } from "app/utils/general";
import { Icon } from "../Icon";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { useDimensions } from "app/hooks/useDimensions";

export const PayoutsHeader = ({
  vendor,
  style,
}: {
  vendor: Vendor;
  style?: ViewStyle;
}) => {
  const { width } = useDimensions();
  const desktopLayout = width > 750;

  const {
    balanceAvailable,
    balancePending,
    balanceCurrency,
    openDashboard,
    createAccountLoading,
    connectAccount,
    createPayout,
    payoutLoading,
    openDashboardLoading,
  } = useStripeConnect(vendor);

  const accountActive =
    vendor.stripe.detailsSubmitted && vendor.stripe.payoutsEnabled;

  const PayoutLoading = useLoadingIndicator(payoutLoading, {
    color: colors.white,
  });
  const DashboardLoading = useLoadingIndicator(openDashboardLoading, {
    color: colors.white,
  });

  return (
    <View
      style={[
        $borderedArea,
        desktopLayout && $row,
        { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
        style,
      ]}
    >
      <View style={[$flex, !desktopLayout && { marginBottom: spacing.sm }]}>
        <Text preset="heading">{"Payments"}</Text>
        <View style={$row}>
          <Icon
            icon={accountActive ? "check-circle" : "alert-circle"}
            color={accountActive ? colors.success : colors.error}
            style={{ marginRight: spacing.xs }}
          />
          <Text>
            {accountActive
              ? "Enabled"
              : "Set up your account to accept payments"}
          </Text>
        </View>
      </View>
      {accountActive && (
        <View
          style={{
            paddingRight: spacing.lg,
            marginBottom: desktopLayout ? 0 : spacing.sm,
          }}
        >
          <Text size={"xxs"}>Your balance</Text>
          <Text preset="heading">
            {localizeCurrency(
              (balanceAvailable + balancePending) / 100,
              balanceCurrency
            )}
          </Text>
          <Text size={"xs"}>
            {localizeCurrency(balanceAvailable / 100, balanceCurrency)}{" "}
            available
          </Text>
        </View>
      )}
      {accountActive ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: desktopLayout ? "row" : "column",
          }}
        >
          <ButtonSmall
            preset={balanceAvailable ? "reversed" : "default"}
            text="Payout now"
            disabled={!balanceAvailable}
            textStyle={
              !balanceAvailable ? { color: colors.textDim } : undefined
            }
            onPress={createPayout}
            RightAccessory={PayoutLoading}
            style={{
              alignSelf: "stretch",
              marginRight: desktopLayout ? spacing.md : 0,
            }}
          />
          <ButtonSmall
            onPress={() => openDashboard()}
            text={"View Payouts"}
            preset="filled"
            style={{
              alignSelf: "stretch",
              marginTop: desktopLayout ? 0 : spacing.xs,
            }}
            RightAccessory={DashboardLoading}
          />
        </View>
      ) : (
        <ButtonSmall onPress={connectAccount} preset="reversed" noTextComponent>
          <View style={$row}>
            <Text style={{ color: "#fff" }}>Connect with</Text>
            <Image
              source={require("../../../assets/images/stripe-logo-sm.png")}
              style={{
                height: 40,
                width: 40 * (937 / 446),
                marginLeft: 5,
              }}
              resizeMode="contain"
            />
            {createAccountLoading && (
              <ActivityIndicator
                color="#fff"
                style={{ marginLeft: spacing.xs }}
              />
            )}
          </View>
        </ButtonSmall>
      )}
    </View>
  );
};
