import { createContext, MutableRefObject } from "react";


export const DrawerContext = createContext({
  drawerRef: { current: null } as MutableRefObject<{
    openDrawer: (config?: { speed?: number; }) => void;
    closeDrawer: (config?: { speed?: number; }) => void;
  } | null>,
  open: false,
  setAlwaysOpen: (always: boolean) => { },
  alwaysOpen: false,
});
