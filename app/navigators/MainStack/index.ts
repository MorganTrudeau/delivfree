import Config from "react-native-config";
import { renderConsumerMainStack } from "./ConsumerMainStack";
import { renderVendorMainStack } from "./VendorMainStack";
import { renderAdminMainStack } from "./AdminMainStack";
import { Stripe } from "stripe";
import { Driver, UserType, Vendor } from "delivfree";
import { renderDriverMainStack } from "./DriverMainStack";
import { getAppType } from "app/utils/general";

export const renderMainStack = ({
  vendorSubscription,
  driverSubscription,
  userType,
  driver,
  vendor,
}: {
  vendorSubscription: Stripe.Subscription | null | undefined;
  driverSubscription: Stripe.Subscription | null | undefined;
  userType: UserType | null | undefined;
  driver: Driver | null | undefined;
  vendor: Vendor | null | undefined;
}) => {
  const appType = getAppType();
  if (appType === "VENDOR") {
    if (userType === "driver") {
      return renderDriverMainStack({
        vendorSubscription,
        driverSubscription,
        driver,
        vendor,
      });
    } else {
      return renderVendorMainStack({ vendorSubscription, vendor });
    }
  } else if (appType === "ADMIN") {
    return renderAdminMainStack();
  } else {
    return renderConsumerMainStack();
  }
};
