import React, { useMemo, useState } from "react";
import { useAppSelector } from "app/redux/store";
import { getTotalPositions } from "app/utils/positions";
import { subscribe } from "app/apis/stripe";
import { alertCommonError } from "app/utils/general";
import { useAlert, useToast } from "app/hooks";
import { ManageSubscription } from "./ManageSubscription";

export const ManageVendorSubscription = ({
  displayOnly,
}: {
  displayOnly?: boolean;
}) => {
  const Alert = useAlert();
  const Toast = useToast();

  const [loading, setLoading] = useState(false);

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

  const handleSubscribe = async () => {
    try {
      if (!(vendor && user)) {
        throw "missing-data";
      }
      setLoading(true);
      await subscribe(
        "vendor",
        vendor?.id,
        user?.email,
        fullTime,
        partTime,
        vendorSubscription
      );
      if (vendorSubscription) {
        Toast.show("Subscription activated successfully!");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alertCommonError(Alert);
    }
  };

  const description = `Your positions have been filled. Activate your drivers' licenses by clicking on the button below.`;

  return (
    <ManageSubscription
      loading={loading}
      licenses={activeLicenses}
      onSubscribe={handleSubscribe}
      displayOnly={displayOnly}
      subscription={vendorSubscription}
      description={description}
    />
  );
};
