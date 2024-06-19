import React, { useMemo } from "react";
import { Button, Text } from "app/components";
import { $borderTop, $borderedArea } from "app/components/styles";
import { spacing } from "app/theme";
import { Card } from "app/components/Card";
import { LicenseItem } from "app/components/Licenses/LicenseItem";
import { ActivityIndicator, View } from "react-native";
import { License } from "functions/src/types";
import { SubscriptionInfo } from "./SubscriptionInfo";
import Stripe from "stripe";
import { ReferralCodeInput } from "./ReferralCodeInput";

export const ManageSubscription = ({
  loading,
  displayOnly,
  onSubscribe,
  subscription,
  licenses,
  description,
  onReferralCodeVerified,
  freeTrialReward,
}: {
  loading: boolean;
  onSubscribe: () => void;
  licenses: License[];
  subscription: Stripe.Subscription | null | undefined;
  displayOnly?: boolean;
  description: string;
  onReferralCodeVerified?: (code: string) => void;
  freeTrialReward?: boolean;
}) => {
  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [loading]
  );

  return (
    <Card>
      {/* <AppLogo style={{ marginBottom: spacing.lg }} height={50} /> */}
      <Text preset="heading" style={{ marginBottom: spacing.md }}>
        License subscription
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
        <View style={$borderedArea}>
          <SubscriptionInfo
            subscription={subscription}
            style={{ paddingVertical: 0 }}
          />
        </View>
      ) : (
        <View style={$borderedArea}>
          <Text>
            You do not have a subscription. Contact us for more information.
          </Text>
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
    </Card>
  );
};
