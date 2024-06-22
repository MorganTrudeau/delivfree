import React, { useMemo, useState } from "react";
import { useAppSelector } from "app/redux/store";
import { getTotalPositions } from "app/utils/positions";
import { subscribe } from "app/apis/stripe";
import { alertCommonError } from "app/utils/general";
import { useAlert, useCheckout, useToast } from "app/hooks";
import { ManageSubscription } from "./ManageSubscription";
import { updateDriver } from "app/apis/driver";
import { PaymentSuccess } from "../PaymentSuccess";
import { getPositionsPrice } from "app/utils/subscriptions";
import Stripe from "stripe";
import { withStripe } from "app/hocs/withStripe";

export const ManageDriverSubscription = withStripe(
  function ManageDriverSubscription({
    displayOnly,
  }: {
    displayOnly?: boolean;
  }) {
    const Alert = useAlert();
    const Toast = useToast();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [referralCode, setReferralCode] = useState("");

    const user = useAppSelector((state) => state.user.user);
    const driver = useAppSelector((state) => state.driver.activeDriver);
    const subscription = useAppSelector(
      (state) => state.subscription.driverSubscription
    );
    const licenses = useAppSelector((state) => state.driver.licenses);

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

      const fullTimePrice = getPositionsPrice("driver", "fullTime");
      const partTimePrice = getPositionsPrice("driver", "partTime");

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
        if (!(driver && user)) {
          throw "missing-data";
        }
        setLoading(true);
        await onSubscribe({
          freeTrial: true,
          email: user.email,
          lineItems,
          subscription: subscription,
          metadata: { driver: driver.id },
        });
        setLoading(false);
        if (referralCode) {
          await updateDriver(driver.id, { referralCode });
        }
        if (subscription && subscription.status !== "canceled") {
          Toast.show("Subscription activated successfully!");
        }
      } catch (error) {
        setLoading(false);
        alertCommonError(Alert);
      }
    };

    const description = `Your license${
      activeLicenses.length > 1 ? "s have" : " has"
    } been approved. Activate your license subscription by clicking on the button below.`;

    if (success) {
      return <PaymentSuccess title={"Subscription activated"} />;
    }

    return (
      <ManageSubscription
        loading={loading}
        licenses={activeLicenses}
        onSubscribe={handleSubscribe}
        subscription={subscription}
        description={description}
        displayOnly={displayOnly}
        onReferralCodeVerified={setReferralCode}
      />
    );
  }
);
