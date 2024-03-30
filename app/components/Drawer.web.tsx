import { colors } from "app/theme";
import React, {
  useRef,
  createContext,
  MutableRefObject,
  useState,
} from "react";
import { DrawerLayout } from "react-native-gesture-handler";
import { View, ViewProps, ViewStyle, useWindowDimensions } from "react-native";
import { DrawerContent } from "./DrawerContent";
import { NavigationProp } from "app/navigators";

export const DrawerContext = createContext({
  drawerRef: { current: null } as MutableRefObject<DrawerLayout | null>,
  open: false,
});

export const Drawer = ({
  children,
  navigation,
}: {
  children: ViewProps["children"];
  navigation: NavigationProp;
}) => {
  const drawerRef = useRef<DrawerLayout>(null);
  const [open, setOpen] = useState(false);

  const { width } = useWindowDimensions();

  return (
    <DrawerContext.Provider value={{ drawerRef, open }}>
      <View style={$row}>
        <View style={[$drawerContentWrapper, { width: width * 0.2 }]}>
          <View style={[$fixedDrawerContentContainer, { width: width * 0.2 }]}>
            <DrawerContent
              navigation={navigation}
              onItemPress={() => {
                setTimeout(() => {
                  drawerRef.current?.closeDrawer();
                }, 3000);
              }}
            />
          </View>
        </View>
        {children}
      </View>
    </DrawerContext.Provider>
  );
};

const DRAWER_WIDTH = 350;

const $row: ViewStyle = { flexDirection: "row", flex: 1 };

const $drawerContentWrapper: ViewStyle = {
  width: DRAWER_WIDTH,
  zIndex: 1000,
};

const $fixedDrawerContentContainer: ViewStyle = {
  // @ts-ignore
  position: "fixed",
  width: "100%",
  // @ts-ignore
  height: "100vh",
  shadowOffset: { width: 2, height: 0 },
  shadowRadius: 4,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  backgroundColor: colors.surface,
  zIndex: 1000,
};
