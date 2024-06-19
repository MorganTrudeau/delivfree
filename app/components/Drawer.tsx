import { colors } from "app/theme";
import React, {
  useRef,
  createContext,
  MutableRefObject,
  useState,
} from "react";
import {
  DrawerLayout,
  DrawerLayoutProps,
  DrawerState,
} from "react-native-gesture-handler";
import { Dimensions, Platform } from "react-native";
import { DrawerContent } from "./DrawerContent";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { AppStackParamList } from "app/navigators/StackNavigator";

export const DrawerContext = createContext({
  drawerRef: { current: null } as MutableRefObject<DrawerLayout | null>,
  open: false,
  setAlwaysOpen: (always: boolean) => {},
  alwaysOpen: false,
});

export const Drawer = ({
  children,
  navigation,
  disabled,
  ...rest
}: Partial<DrawerLayoutProps> & {
  navigation: NavigationContainerRefWithCurrent<AppStackParamList>;
  disabled?: boolean;
}) => {
  const drawerRef = useRef<DrawerLayout>(null);
  const [open, setOpen] = useState(false);

  const [alwaysOpen, setAlwaysOpen] = useState(false);

  const closeDrawer = () => {
    drawerRef.current?.closeDrawer();
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <DrawerContext.Provider
      value={{ drawerRef, open, setAlwaysOpen, alwaysOpen }}
    >
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={Platform.select({
          default: 326,
          web: Dimensions.get("window").width * 0.3,
        })}
        drawerLockMode={alwaysOpen ? "locked-open" : "unlocked"}
        drawerType={"slide"}
        overlayColor={open ? colors.palette.overlay20 : "transparent"}
        onDrawerStateChanged={(
          newState: DrawerState,
          drawerWillShow: boolean
        ) => {
          if (newState === "Settling") {
            setOpen(drawerWillShow);
          }
        }}
        renderNavigationView={() => (
          <DrawerContent
            navigation={navigation}
            onItemPress={closeDrawer}
            closeDrawer={closeDrawer}
            alwaysOpen={alwaysOpen}
          />
        )}
        {...rest}
      >
        {children}
      </DrawerLayout>
    </DrawerContext.Provider>
  );
};
