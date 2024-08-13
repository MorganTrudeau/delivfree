import { createContext, MutableRefObject } from "react";
import { DrawerLayout } from "react-native-gesture-handler";


export const DrawerContext = createContext({
  drawerRef: { current: null } as MutableRefObject<DrawerLayout | null>,
  open: false,
  setAlwaysOpen: (always: boolean) => { },
  alwaysOpen: false,
});
