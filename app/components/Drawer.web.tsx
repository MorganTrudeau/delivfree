import { colors } from "app/theme";
import React, {
  useRef,
  createContext,
  MutableRefObject,
  useState,
} from "react";
import { DrawerLayout } from "react-native-gesture-handler";
import { View, ViewProps } from "react-native";
import { DrawerContent } from "./DrawerContent";
import { NavigationProp } from "app/navigators";
import { $row, $shadow } from "./styles";

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

  return (
    <DrawerContext.Provider value={{ drawerRef, open }}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: 375,
            zIndex: 1000,
          }}
        >
          <View
            style={{
              position: "fixed",
              width: 375,
              height: "100vh",
              shadowOffset: { width: 2, height: 0 },
              shadowRadius: 4,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              backgroundColor: colors.background,
              zIndex: 1000,
            }}
          >
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
