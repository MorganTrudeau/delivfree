import Config from "react-native-config";
import { renderVendorRegistrationStack } from "./VendorRegistrationStack";
import { renderAdminRegistrationStack } from "./AdminRegistrationStack";
import { renderConsumerRegistrationStack } from "./ConsumerRegistrationStack";
import { User } from "functions/src/types";

export const renderRegistrationStack = ({
  user,
}: {
  user: User | null | undefined;
}) => {
  if (Config.APP === "VENDOR") {
    return renderVendorRegistrationStack({ user });
  } else if (Config.APP === "ADMIN") {
    return renderAdminRegistrationStack();
  } else {
    return renderConsumerRegistrationStack();
  }
};
