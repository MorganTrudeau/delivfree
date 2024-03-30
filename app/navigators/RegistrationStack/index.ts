import Config from "react-native-config";
import { renderVendorRegistrationStack } from "./VendorRegistrationStack";
import { renderAdminRegistrationStack } from "./AdminRegistrationStack";
import { renderConsumerRegistrationStack } from "./ConsumerRegistrationStack";

export const renderRegistrationStack = () => {
  if (Config.APP === "VENDOR") {
    return renderVendorRegistrationStack();
  } else if (Config.APP === "ADMIN") {
    return renderAdminRegistrationStack();
  } else {
    return renderConsumerRegistrationStack();
  }
};
