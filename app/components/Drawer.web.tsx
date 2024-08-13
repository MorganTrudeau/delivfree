import { colors } from "app/theme";
import React, { useRef, useState, useEffect } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { DrawerContent } from "./DrawerContent";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDimensions } from "app/hooks/useDimensions";
import { AppStackParamList } from "app/navigators/AppStackParamList";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { isLargeScreen } from "./styles";
import { DrawerContext } from "./DrawerContext.web";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Drawer = ({
  children,
  navigation,
  disabled,
}: {
  children: ViewProps["children"];
  navigation: NavigationContainerRefWithCurrent<AppStackParamList>;
  disabled?: boolean;
}) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const [alwaysOpen, setAlwaysOpen] = useState(
    false // largeScreen && getAppType() === "ADMIN"
  );
  const [open, setOpen] = useState(false);
  const openAnimation = useSharedValue(0);

  // useOnChange(largeScreen, (next) => {
  //   if (getAppType() === "ADMIN") {
  //     setAlwaysOpen(next);
  //   }
  // });

  useEffect(() => {
    if (alwaysOpen && open) {
      closeDrawer();
    }
  }, [open, alwaysOpen]);

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
      left: !alwaysOpen
        ? interpolate(openAnimation.value, [0, 1], [-drawerWidth, 0])
        : 0,
    }),
    [openAnimation, drawerWidth, alwaysOpen]
  );

  const backdropStyle = useAnimatedStyle(
    () => ({ opacity: openAnimation.value }),
    [openAnimation]
  );

  const childrenAnimation = useAnimatedStyle(() => ({
    flex: 1,
    overflow: "hidden",
    transform: [
      { translateX: interpolate(openAnimation.value, [0, 1], [0, 100]) },
    ],
  }));

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <DrawerContext.Provider
      value={{ drawerRef, open, setAlwaysOpen, alwaysOpen }}
    >
      <View style={[$row, { overflow: "hidden" }]}>
        <Animated.View
          style={[
            $drawerContentWrapper,
            {
              width: drawerWidth,
              zIndex: 500,
              position: alwaysOpen ? undefined : "absolute",
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
              onItemPress={closeDrawer}
              closeDrawer={closeDrawer}
              alwaysOpen={alwaysOpen}
            />
          </View>
        </Animated.View>
        <Animated.View style={childrenAnimation}>{children}</Animated.View>
        {!alwaysOpen && (
          <AnimatedPressable
            onPress={closeDrawer}
            style={[$backdrop, backdropStyle]}
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
const $backdrop: StyleProp<ViewStyle> = [
  StyleSheet.absoluteFill,
  { backgroundColor: colors.palette.overlay20 },
];
