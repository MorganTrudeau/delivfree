import React, { useMemo, useState } from "react";
import { useAppSelector } from "app/redux/store";
import { getTotalPositions } from "app/utils/positions";
import { subscribe } from "app/apis/stripe";
import { alertCommonError } from "app/utils/general";
import { useAlert, useToast } from "app/hooks";
import { ManageSubscription } from "./ManageSubscription";
import { updateDriver } from "app/apis/driver";

export const ManageDriverSubscription = ({
  displayOnly,
}: {
  displayOnly?: boolean;
}) => {
  const Alert = useAlert();
  const Toast = useToast();

  const [loading, setLoading] = useState(false);
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

  const handleSubscribe = async () => {
    try {
      if (!(driver && user)) {
        throw "missing-data";
      }
      setLoading(true);
      await subscribe(
        "driver",
        driver?.id,
        user?.email,
        fullTime,
        partTime,
        subscription,
        true
      );
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
};
