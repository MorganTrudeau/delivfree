import { useScrollToTop } from "@react-navigation/native";
import { StatusBar, StatusBarProps } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingViewProps,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { colors, spacing } from "../theme";
import {
  ExtendedEdge,
  useSafeAreaInsetsStyle,
} from "../utils/useSafeAreaInsetsStyle";
import { DrawerIconButton } from "./DrawerIconButton";
import { Header, HeaderProps } from "./Header";
import { LogoHeader } from "./LogoHeader";
import { useDimensions } from "app/hooks/useDimensions";
import { $flex, LARGE_SCREEN, MAX_CONTENT_WIDTH } from "./styles";

interface BaseScreenProps {
  HeaderTitle?: React.ReactNode;

  title?: string;

  inDrawer?: boolean;
  /**
   * Children components.
   */
  children?: React.ReactNode;
  /**
   * Style for the outer content container useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the inner content container useful for padding & margin.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Override the default edges for the safe area.
   */
  safeAreaEdges?: ExtendedEdge[];
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Status bar setting. Defaults to dark.
   */
  statusBarStyle?: "light" | "dark";
  /**
   * By how much should we offset the keyboard? Defaults to 0.
   */
  keyboardOffset?: number;
  /**
   * Pass any additional props directly to the StatusBar component.
   */
  StatusBarProps?: StatusBarProps;
  /**
   * Pass any additional props directly to the KeyboardAvoidingView component.
   */
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  /**
   * Pass props to Header component
   */
  headerProps?: HeaderProps;
}

interface FixedScreenProps extends BaseScreenProps {
  preset?: "fixed";
}
interface ScrollScreenProps extends BaseScreenProps {
  preset?: "scroll";
  /**
   * Should keyboard persist on screen tap. Defaults to handled.
   * Only applies to scroll preset.
   */
  keyboardShouldPersistTaps?: "handled" | "always" | "never";
  /**
   * Pass any additional props directly to the ScrollView component.
   */
  ScrollViewProps?: ScrollViewProps;
}

interface AutoScreenProps extends Omit<ScrollScreenProps, "preset"> {
  preset?: "auto";
  /**
   * Threshold to trigger the automatic disabling/enabling of scroll ability.
   * Defaults to `{ percent: 0.92 }`.
   */
  scrollEnabledToggleThreshold?: { percent?: number; point?: number };
}

export type ScreenProps =
  | ScrollScreenProps
  | FixedScreenProps
  | AutoScreenProps;

function isNonScrolling(preset?: ScreenProps["preset"]) {
  return !preset || preset === "fixed";
}

function useAutoPreset(props: AutoScreenProps) {
  const { preset, scrollEnabledToggleThreshold } = props;
  const { percent = 0.92, point = 0 } = scrollEnabledToggleThreshold || {};

  const scrollViewHeight = useRef<number | null>(null);
  const scrollViewContentHeight = useRef<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  function updateScrollState() {
    if (
      scrollViewHeight.current === null ||
      scrollViewContentHeight.current === null
    )
      return;

    // check whether content fits the screen then toggle scroll state according to it
    const contentFitsScreen = (function () {
      if (point) {
        return (
          scrollViewContentHeight.current < scrollViewHeight.current - point
        );
      } else {
        return (
          scrollViewContentHeight.current < scrollViewHeight.current * percent
        );
      }
    })();

    // content is less than the size of the screen, so we can disable scrolling
    if (scrollEnabled && contentFitsScreen) setScrollEnabled(false);

    // content is greater than the size of the screen, so let's enable scrolling
    if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true);
  }

  function onContentSizeChange(w: number, h: number) {
    // update scroll-view content height
    scrollViewContentHeight.current = h;
    updateScrollState();
  }

  function onLayout(e: LayoutChangeEvent) {
    const { height } = e.nativeEvent.layout;
    // update scroll-view  height
    scrollViewHeight.current = height;
    updateScrollState();
  }

  // update scroll state on every render
  if (preset === "auto") updateScrollState();

  return {
    scrollEnabled: preset === "auto" ? scrollEnabled : true,
    onContentSizeChange,
    onLayout,
  };
}

function ScreenWithoutScrolling(props: ScreenProps) {
  const { style, contentContainerStyle, children } = props;
  return (
    <View style={[$outerStyle, style]}>
      <View style={[$innerStyle, $flex, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
}

function ScreenWithScrolling(props: ScreenProps) {
  const {
    children,
    keyboardShouldPersistTaps = "handled",
    contentContainerStyle,
    ScrollViewProps,
    style,
  } = props as ScrollScreenProps;

  const ref = useRef<ScrollView>(null);

  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(
    props as AutoScreenProps
  );

  // Add native behavior of pressing the active tab to scroll to the top of the content
  // More info at: https://reactnavigation.org/docs/use-scroll-to-top/
  useScrollToTop(ref);

  return (
    <ScrollView
      {...{ keyboardShouldPersistTaps, scrollEnabled, ref }}
      {...ScrollViewProps}
      onLayout={(e) => {
        onLayout(e);
        ScrollViewProps?.onLayout?.(e);
      }}
      onContentSizeChange={(w: number, h: number) => {
        onContentSizeChange(w, h);
        ScrollViewProps?.onContentSizeChange?.(w, h);
      }}
      style={[$outerStyle, ScrollViewProps?.style, style]}
      contentContainerStyle={[
        $innerStyle,
        ScrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Screen(props: ScreenProps) {
  const { width } = useDimensions();
  const largeScreenLayout = width > LARGE_SCREEN;
  const {
    backgroundColor = colors.background,
    safeAreaEdges,
    StatusBarProps,
    statusBarStyle = "dark",
    inDrawer,
    title,
    HeaderTitle,
    headerProps,
  } = props;

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);

  return (
    <View style={[$containerStyle, { backgroundColor }, $containerInsets]}>
      <StatusBar
        style={statusBarStyle}
        backgroundColor={colors.background}
        {...StatusBarProps}
      />

      {/* {(!largeScreenLayout || !inDrawer) && (
        <Header
          LeftActionComponent={
            inDrawer && !largeScreenLayout ? <DrawerIconButton /> : undefined
          }
          title={title}
          HeaderTitle={
            HeaderTitle ||
            (inDrawer && !largeScreenLayout ? <LogoHeader /> : undefined)
          }
          {...headerProps}
        />
      )} */}

      <View style={$wrapper}>
        {isNonScrolling(props.preset) ? (
          <ScreenWithoutScrolling {...props} />
        ) : (
          <ScreenWithScrolling {...props} />
        )}
      </View>
    </View>
  );
}

const $wrapper: ViewStyle = {
  flex: 1,
  maxWidth: MAX_CONTENT_WIDTH,
  width: "100%",
  alignSelf: "center",
};

const $containerStyle: ViewStyle = {
  flex: 1,
};

const $outerStyle: ViewStyle = {
  flex: 1,
};

const $innerStyle: ViewStyle = {
  justifyContent: "flex-start",
  alignItems: "stretch",
};
