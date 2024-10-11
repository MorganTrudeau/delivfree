import { colors, fontSize, spacing, typography } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { sizing } from "app/theme/sizing";
import {
  Dimensions,
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ImageStyle } from "react-native-fast-image";
import { Edge } from "react-native-safe-area-context";

export const getHeaderHeight = (): number => {
  const { width, height } = Dimensions.get("window");

  const isLandscape = width > height;

  let headerHeight;

  if (Platform.OS === "ios") {
    if (isLandscape && !Platform.isPad) {
      headerHeight = 44;
    } else {
      headerHeight = 44;
    }
  } else if (Platform.OS === "android") {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  return headerHeight;
};

export const LARGE_SCREEN = 1000;
export const MAX_CONTENT_WIDTH = 1200;

export const WEB_NOTIFICATION_HEIGHT = 80;
export const WEB_NOTIFICATION_WIDTH = 350;

export const NO_TOP_BOTTOM_SAFE_AREA_EDGES: Edge[] = [
  "bottom",
  "right",
  "left",
];
export const NO_BOTTOM_SAFE_AREA_EDGES: Edge[] = ["top", "right", "left"];
export const SAFE_AREA_EDGES: Edge[] = ["top", "right", "left", "bottom"];
export const HORIZONTAL_SAFE_AREA_EDGES: Edge[] = ["right", "left"];

export const MAX_CENTER_MODAL_WIDTH = Platform.select({
  web: 600,
  default: 650,
});
export const MAX_CONTAINER_WIDTH = Platform.select({ default: 700, web: 900 });
export const LG_SCREEN = Dimensions.get("window").width > 700;

export const isLargeScreen = (width: number) => width > LARGE_SCREEN;

export const $card: ViewStyle = {
  padding: spacing.lg,
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 10,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  elevation: 2,
  zIndex: 2,
  width: "100%",
  maxWidth: MAX_CONTENT_WIDTH,
  alignSelf: Platform.select({ default: "center", web: "center" }),
  borderRadius: 6,
  backgroundColor: colors.background,
  borderColor: colors.border,
  borderWidth: StyleSheet.hairlineWidth,
};
export const $containerPadding: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  flexGrow: 1,
};
export const $screen: ViewStyle = {
  flex: 1,
};
export const $screenHeading: TextStyle = {
  marginBottom: spacing.md,
};

export const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
export const $rowCenter: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};
export const $rowBetween: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};
export const $rowAround: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
};
export const $rowEnd: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
};

export const $flexStretch: ViewStyle = {
  flex: 1,
  alignSelf: "stretch",
};
export const $flexShrink: ViewStyle = {
  flexShrink: 1,
};
export const $flex: ViewStyle = {
  flex: 1,
};
export const $flexEnd: ViewStyle = {
  flex: 1,
  alignItems: "flex-end",
};
export const $flexCenter: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};
export const $flexRowBetween: ViewStyle = {
  flexDirection: "row",
  flex: 1,
  alignItems: "center",
  justifyContent: "space-between",
};
export const $flexRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
};

export const $flexGrow: ViewStyle = {
  flexGrow: 1,
};

export const $textCenter: TextStyle = {
  textAlign: "center",
};

export const $shadow: ViewStyle = {
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 4,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  elevation: 3,
};

export const $shadowWhite: ViewStyle = {
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 4,
  shadowColor: "#fff",
  shadowOpacity: 0.2,
  elevation: 3,
};

export const $avatar: ImageStyle = {
  width: 35,
  height: 35,
  borderRadius: 25,
  justifyContent: "center",
  alignItems: "center",
};

export const $border = {
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border,
};
export const $borderLight = {
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.borderLight,
};
export const $borderTop: ViewStyle = {
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: colors.border,
};
export const $borderBottom: ViewStyle = {
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.border,
};
export const $borderTopLight: ViewStyle = {
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: colors.borderLight,
};
export const $borderBottomLight: ViewStyle = {
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.borderLight,
};

export const $emptyText: TextStyle = {
  color: colors.textDim,
  textAlign: "center",
};

export const $buttonText: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.primary.medium,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
};

export const $borderedArea: ViewStyle = {
  backgroundColor: colors.palette.neutral200,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderRadius: borderRadius.md,
  borderColor: colors.border,
  borderWidth: StyleSheet.hairlineWidth,
};

export const $popover: ViewStyle = {
  maxWidth: 450,
  backgroundColor: colors.background,
  borderRadius: 4,
};
export const $popoverItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  justifyContent: "space-between",
};
export const $popoverIcon: ViewStyle = { marginEnd: spacing.sm };
export const $popoverLoader: ViewStyle = {
  height: sizing.lg,
  width: sizing.lg,
  alignItems: "center",
  justifyContent: "center",
  marginStart: spacing.sm,
};

export const $listItemButton: ViewStyle = {
  paddingVertical: spacing.xxs,
  minHeight: 0,
};
export const $image: ImageStyle = {
  height: "100%",
  width: "100%",
  aspectRatio: 2.5,
  borderRadius: borderRadius.md,
};
export const $imageContainer: StyleProp<ViewStyle> = [
  $shadow,
  {
    borderRadius: borderRadius.md,
    width: "100%",
    position: "relative",
    // maxWidth: 400,
    aspectRatio: 2.5,
    backgroundColor: colors.background,
  },
];

export const $inputFormContainer: ViewStyle = { marginTop: spacing.sm };
export const $input: TextStyle = {
  paddingHorizontal: spacing.xs,
  backgroundColor: colors.palette.neutral200,
  borderWidth: StyleSheet.hairlineWidth,
  borderRadius: borderRadius.sm,
  color: colors.text,
  minHeight: 38,
  flexDirection: "column",
  justifyContent: "center",
  // @ts-ignore
  outlineStyle: "none",
  borderColor: colors.border,
  ...fontSize.sm,
};

export const $adNoText: ImageStyle = {
  width: "100%",
  maxWidth: 500,
  aspectRatio: 4,
  borderRadius: borderRadius.md,
};
export const $adWithText: ImageStyle = {
  width: "100%",
  maxWidth: 500,
  aspectRatio: 4,
  borderTopRightRadius: borderRadius.md,
  borderTopLeftRadius: borderRadius.md,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.borderLight,
  borderBottomWidth: 0,
};

export const $formLabel: TextStyle = {
  marginBottom: spacing.xxs,
};

export const $headerButton: ViewStyle = {
  marginHorizontal: Platform.select({ web: spacing.md, default: 0 }),
};

export const $menusScreenHeader: ViewStyle = {
  paddingTop: spacing.md,
};

export const $spacerBorder: ViewStyle = {
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: colors.borderLight,
  marginVertical: spacing.md,
};
