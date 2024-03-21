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
import { NavigationProp } from "app/navigators";

export const DrawerContext = createContext({
  drawerRef: { current: null } as MutableRefObject<DrawerLayout | null>,
  open: false,
});

export const Drawer = ({
  children,
  navigation,
  ...rest
}: Partial<DrawerLayoutProps> & {
  navigation: NavigationProp;
}) => {
  const drawerRef = useRef<DrawerLayout>(null);
  const [open, setOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ drawerRef, open }}>
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={Platform.select({
          default: 326,
          web: Dimensions.get("window").width * 0.3,
        })}
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
            onItemPress={() => drawerRef.current?.closeDrawer()}
          />
        )}
        {...rest}
      >
        {children}
      </DrawerLayout>
    </DrawerContext.Provider>
  );
};
