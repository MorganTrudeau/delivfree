import React, { useMemo } from "react";
import { Button, Text } from "app/components";
import { $borderTop, $borderedArea, $flex } from "app/components/styles";
import { colors, spacing } from "app/theme";
import { Card } from "app/components/Card";
import { LicenseItem } from "app/components/Licenses/LicenseItem";
import { ActivityIndicator, Platform, Pressable, View } from "react-native";
import { License, UserType } from "delivfree";
import { SubscriptionInfo } from "./SubscriptionInfo";
import Stripe from "stripe";
import { ReferralCodeInput } from "./ReferralCodeInput";
import { PaymentMethodSelectButton } from "../Stripe/PaymentMethodButton";

export const ManageSubscription = ({
  loading,
  displayOnly,
  onSubscribe,
  subscription,
  licenses,
  description,
  onReferralCodeVerified,
  freeTrialReward,
  noSubscriptionMessage,
  title,
  onApplyForLicense,
}: {
  loading: boolean;
  onSubscribe: () => void;
  licenses: License[];
  subscription: Stripe.Subscription | null | undefined;
  displayOnly?: boolean;
  description: string;
  onReferralCodeVerified?: (code: string) => void;
  freeTrialReward?: boolean;
  title: string;
  noSubscriptionMessage: string;
  onApplyForLicense?: () => void;
}) => {
  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [loading]
  );

  return (
    <Card smallStyle={$flex}>
      {/* <AppLogo style={{ marginBottom: spacing.lg }} height={50} /> */}
      <Text preset="heading" style={{ marginBottom: spacing.md }}>
        {title}
      </Text>

      {!displayOnly ? (
        <>
          <Text style={{ marginBottom: spacing.md }}>{description}</Text>

          {onReferralCodeVerified && (
            <ReferralCodeInput
              freeTrialReward={freeTrialReward}
              onVerified={onReferralCodeVerified}
              style={{ marginBottom: spacing.md }}
            />
          )}

          <Button
            text="Activate license subscription"
            onPress={onSubscribe}
            preset="filled"
            RightAccessory={Loading}
          />
        </>
      ) : subscription ? (
        <>
          <View style={$borderedArea}>
            <SubscriptionInfo
              subscription={subscription}
              style={{ paddingVertical: 0 }}
            />
          </View>
          <Text
            size={"xs"}
            style={{ color: colors.textDim, marginTop: spacing.xxs }}
          >
            Contact us at info@delivfree.com to manage your positions
          </Text>
          {Platform.OS === "web" && (
            <PaymentMethodSelectButton
              style={{
                ...$borderedArea,
                alignSelf: "flex-start",
                marginTop: spacing.sm,
              }}
              customer={
                typeof subscription.customer === "string"
                  ? subscription.customer
                  : subscription.customer.id
              }
              subscription={subscription.id}
              defaultPaymentMethod={
                typeof subscription.default_payment_method === "string"
                  ? subscription.default_payment_method
                  : subscription.default_payment_method?.id
              }
            />
          )}
        </>
      ) : (
        <View style={$borderedArea}>
          <Text>{noSubscriptionMessage}</Text>
        </View>
      )}

      <View style={[$borderTop, { marginVertical: spacing.lg }]} />

      <Text preset="subheading" style={{ marginBottom: spacing.xxs }}>
        Approved licenses
      </Text>
      {!!licenses.length ? (
        licenses.map((l) => (
          <LicenseItem
            key={l.id}
            licenseId={l.id}
            minDetails
            style={{ marginBottom: spacing.sm }}
          />
        ))
      ) : (
        <Text>You have no approved licenses</Text>
      )}

      {onApplyForLicense && (
        <Pressable onPress={onApplyForLicense}>
          <Text style={{ color: colors.primary }}>Apply for license</Text>
        </Pressable>
      )}
    </Card>
  );
};
