import { colors, spacing } from "app/theme";
import React, {
  useRef,
  createContext,
  MutableRefObject,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { DrawerContent } from "./DrawerContent";
import { NavigationProp } from "app/navigators";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDimensions } from "app/hooks/useDimensions";
import { LARGE_SCREEN } from "./styles";
import { Icon } from "./Icon";

export const DrawerContext = createContext({
  drawerRef: { current: null } as MutableRefObject<{
    openDrawer: () => void;
    closeDrawer: () => void;
  } | null>,
  open: false,
});

export const Drawer = ({
  children,
  navigation,
}: {
  children: ViewProps["children"];
  navigation: NavigationProp;
}) => {
  const { width } = useDimensions();
  const largeScreenLayout = width > LARGE_SCREEN;

  const [open, setOpen] = useState(false);
  const openAnimation = useSharedValue(0);

  const openDrawer = () => {
    openAnimation.value = withTiming(1);
    setOpen(true);
  };

  const closeDrawer = () => {
    openAnimation.value = withTiming(0);
    setOpen(false);
  };

  const drawerRef = useRef<{ openDrawer: () => void; closeDrawer: () => void }>(
    {
      openDrawer,
      closeDrawer,
    }
  );

  const drawerWidth = Math.max(300, width * 0.2);

  const styles = useAnimatedStyle(
    () => ({
      left: !largeScreenLayout
        ? interpolate(openAnimation.value, [0, 1], [-drawerWidth, 0])
        : 0,
    }),
    [openAnimation, drawerWidth, largeScreenLayout]
  );

  return (
    <DrawerContext.Provider value={{ drawerRef, open }}>
      <View style={$row}>
        <Animated.View
          style={[
            $drawerContentWrapper,
            {
              width: drawerWidth,
              zIndex: 500,
              position: largeScreenLayout ? undefined : "absolute",
            },
            styles,
          ]}
        >
          <View
            style={[
              $fixedDrawerContentContainer,
              { width: drawerWidth, zIndex: 500 },
            ]}
          >
            <DrawerContent
              navigation={navigation}
              onItemPress={() => {
                setTimeout(() => {
                  drawerRef.current?.closeDrawer();
                }, 3000);
              }}
            />
            {!largeScreenLayout && (
              <Pressable
                hitSlop={20}
                style={{
                  position: "absolute",
                  top: spacing.sm,
                  right: spacing.sm,
                }}
                onPress={closeDrawer}
              >
                <Icon icon="close" />
              </Pressable>
            )}
          </View>
        </Animated.View>
        {children}
        {open && !largeScreenLayout && (
          <Pressable
            onPress={closeDrawer}
            style={StyleSheet.absoluteFill}
            pointerEvents={open ? "auto" : "none"}
          />
        )}
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
