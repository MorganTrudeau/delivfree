import Config from "react-native-config";
import { renderConsumerMainStack } from "./ConsumerMainStack";
import { renderVendorMainStack } from "./VendorMainStack";
import { renderAdminMainStack } from "./AdminMainStack";
import { Stripe } from "stripe";
import { Driver, UserType, Vendor } from "functions/src/types";
import { renderDriverMainStack } from "./DriverMainStack";

export const renderMainStack = ({
  subscription,
  userType,
  driver,
  vendor,
}: {
  subscription: Stripe.Subscription | null | undefined;
  userType: UserType | null | undefined;
  driver: Driver | null | undefined;
  vendor: Vendor | null | undefined;
}) => {
  if (Config.APP === "VENDOR") {
    if (userType === "driver") {
      return renderDriverMainStack({ subscription, driver, vendor });
    } else {
      return renderVendorMainStack({ subscription, vendor });
    }
  } else if (Config.APP === "ADMIN") {
    return renderAdminMainStack();
  } else {
    return renderConsumerMainStack();
  }
};
