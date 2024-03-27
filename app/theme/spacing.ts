import { Platform } from "react-native";

/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
export const mobileSpacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const webSpacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 24,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const spacing = Platform.select({
  default: mobileSpacing,
  web: webSpacing,
});

export type Spacing = keyof typeof spacing;
