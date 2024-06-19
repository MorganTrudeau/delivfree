import { Platform } from "react-native";
import { DrawerContext as DrawerContextMobile } from "../components/Drawer";
import { DrawerContext as DrawerContentWeb } from "../components/Drawer.web";
import { useContext } from "react";

const useDrawerMobile = () => {
  return useContext(DrawerContextMobile);
};

const useDrawerWeb = () => {
  return useContext(DrawerContentWeb);
};

export const useDrawer = Platform.select({
  web: useDrawerWeb,
  default: useDrawerMobile,
});
