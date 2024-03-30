import Config from "react-native-config";
import { renderConsumerMainStack } from "./ConsumerMainStack";
import { renderVendorMainStack } from "./VendorMainStack";
import { renderAdminMainStack } from "./AdminMainStack";

export const renderMainStack = () => {
  if (Config.APP === "VENDOR") {
    return renderVendorMainStack();
  } else if (Config.APP === "ADMIN") {
    return renderAdminMainStack();
  } else {
    return renderConsumerMainStack();
  }
};
