import { getHeaderHeight } from "app/components/styles";
import { colors, spacing, typography } from "app/theme";
import { fontSize } from "app/theme/fontSize";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

const defaultTitle = "";

export type Props = {
  headerLeft?: () => React.ReactNode;
  headerRight?: () => React.ReactNode;
  headerTitle?:
    | string
    | ((props: { children: string; tintColor?: string }) => React.ReactNode)
    | undefined;
  headerTint?: string;
  title?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  transparent?: boolean;
  hideShadow?: boolean;
  innerStyle?: ViewStyle;
  ignoreInsets?: boolean;
  headerTitleStyle?: ViewStyle;
  insets: EdgeInsets;
};

const HeaderLayout = ({
  headerLeft,
  headerRight,
  headerTitle,
  title = defaultTitle,
  style,
  innerStyle,
  titleStyle,
  transparent,
  hideShadow,
  ignoreInsets,
  headerTitleStyle,
  insets,
  headerTint,
}: Props) => {
  const shouldRenderHeaderTitle =
    typeof headerTitle === "function" || !!headerTitle || !!title;

  return (
    <View
      pointerEvents={transparent ? "box-none" : "auto"}
      style={[
        styles.container,
        !ignoreInsets && {
          paddingTop: insets.top,
        },
        transparent && {
          position: "absolute",
          top: 0,
          backgroundColor: "transparent",
        },
        (transparent || hideShadow) && {
          elevation: 0,
          shadowOpacity: 0,
        },
        style,
      ]}
    >
      <View
        style={[styles.inner, { height: getHeaderHeight() }, innerStyle]}
        pointerEvents={transparent ? "box-none" : "auto"}
      >
        <View style={styles.headerLeft}>
          {typeof headerLeft === "function" ? headerLeft() : headerLeft}
        </View>
        {shouldRenderHeaderTitle && (
          <View
            style={[
              styles.headerTitle,
              headerLeft
                ? styles.headerSpacingWithHeaderLeft
                : styles.headerSpacingWithoutHeaderLeft,
              headerTitleStyle,
            ]}
          >
            <View style={styles.headerTitleInner}>
              {typeof headerTitle === "function" ? (
                headerTitle({ children: title, tintColor: headerTint })
              ) : !!title || !!headerTitle ? (
                <Text
                  style={[styles.title, titleStyle]}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  allowFontScaling={false}
                >
                  {headerTitle || title}
                </Text>
              ) : null}
            </View>
          </View>
        )}
        <View style={styles.headerRight}>
          {typeof headerRight === "function" ? headerRight() : headerRight}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    // borderBottomWidth: 0,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
    // shadowColor: colors.black,
    // shadowOpacity: 0.2,
    // elevation: MID_ELEVATION,
    // zIndex: MID_ELEVATION,
  },
  container: StyleSheet.flatten([
    {
      backgroundColor: colors.background,
      width: "100%",
      justifyContent: "flex-end",
    },
  ]),
  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: StyleSheet.flatten([
    [
      {
        fontFamily: typography.secondary.semiBold,
        color: colors.text,
        textAlign: Platform.select({ ios: "center", default: "left" }),
      },
      fontSize.lg,
    ],
  ]),
  headerLeft: {
    flex: Platform.select({ ios: 1, default: undefined }),
    alignItems: "flex-start",
    paddingHorizontal: spacing.md,
  },
  headerTitle: {
    position: "absolute",
    alignItems: Platform.select({ ios: "center", default: undefined }),
    justifyContent: "center",
  },
  headerSpacingWithHeaderLeft: { left: 64, right: 64 },
  headerSpacingWithoutHeaderLeft: { left: 16, right: 16 },
  headerTitleInner: {
    maxWidth: "60%",
    width: "100%",
    alignItems: Platform.select({ ios: "center", default: undefined }),
  },
  headerRight: {
    flex: Platform.select({ ios: 1, default: undefined }),
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
  },
});

export default React.memo(HeaderLayout);
