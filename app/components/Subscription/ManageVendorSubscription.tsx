import React, { useMemo, useState } from "react";
import { useAppSelector } from "app/redux/store";
import { getTotalPositions } from "app/utils/positions";
import { alertCommonError } from "app/utils/general";
import { useAlert, useCheckout, useToast } from "app/hooks";
import { ManageSubscription } from "./ManageSubscription";
import { updateVendor } from "app/apis/vendors";
import { getPositionsPrice } from "app/utils/subscriptions";
import Stripe from "stripe";
import { PaymentSuccess } from "../PaymentSuccess";
import { withStripe } from "app/hocs/withStripe";

export const ManageVendorSubscription = withStripe(
  ({ displayOnly }: { displayOnly?: boolean }) => {
    const Alert = useAlert();
    const Toast = useToast();

    const [loading, setLoading] = useState(false);
    const [referralCode, setReferralCode] = useState("");
    const [success, setSuccess] = useState(false);

    const user = useAppSelector((state) => state.user.user);
    const vendor = useAppSelector((state) => state.vendor.activeVendor);
    const vendorSubscription = useAppSelector(
      (state) => state.subscription.vendorSubscription
    );
    const licenses = useAppSelector((state) => state.vendor.licenses);

    const activeLicenses = useMemo(
      () => Object.values(licenses).filter((l) => l.status === "approved"),
      []
    );
    const { fullTime, partTime } = useMemo(
      () => getTotalPositions(activeLicenses),
      [activeLicenses]
    );

    const lineItems = useMemo(() => {
      const items: Array<Stripe.Checkout.SessionCreateParams.LineItem> = [];

      const fullTimePrice = getPositionsPrice("vendor", "fullTime");
      const partTimePrice = getPositionsPrice("vendor", "partTime");

      if (fullTime) {
        items.push({
          price: fullTimePrice,
          quantity: fullTime,
        });
      }

      if (partTime) {
        items.push({
          price: partTimePrice,
          quantity: partTime,
        });
      }
      return items;
    }, []);

    const handleSuccess = () => {
      setSuccess(true);
    };

    const { onSubscribe } = useCheckout({
      onPaymentSuccess: handleSuccess,
    });

    const handleSubscribe = async () => {
      try {
        if (!(vendor && user)) {
          throw "missing-data";
        }
        setLoading(true);
        await onSubscribe({
          freeTrial: !!referralCode,
          email: user.email,
          lineItems,
          subscription: vendorSubscription,
          metadata: { vendor: vendor.id },
        });
        if (referralCode) {
          await updateVendor(vendor.id, { referralCode });
        }
        if (vendorSubscription && vendorSubscription.status !== "canceled") {
          Toast.show("Subscription activated successfully!");
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        alertCommonError(Alert);
      }
    };

    const description = `Your positions have been filled. Activate your drivers' licenses by clicking on the button below.`;

    if (success) {
      return <PaymentSuccess title={"Subscription activated"} />;
    }

    return (
      <ManageSubscription
        loading={loading}
        licenses={activeLicenses}
        onSubscribe={handleSubscribe}
        displayOnly={displayOnly}
        subscription={vendorSubscription}
        description={description}
        onReferralCodeVerified={setReferralCode}
        noSubscriptionMessage={"You have no filled positions."}
        freeTrialReward
        title={"Filled positions"}
      />
    );
  }
);
