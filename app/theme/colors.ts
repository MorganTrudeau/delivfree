// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#faf9f9",
  neutral300: "#F4F2F1",
  neutral400: "#D7CEC9",
  neutral500: "#B6ACA6",
  neutral600: "#978F8A",
  neutral700: "#564E4A",
  neutral800: "#191015",
  neutral900: "#000000",

  shade100: "#FFFFFF",
  shade200: "#efebe9",
  shade300: "#D7CEC9",
  shade400: "#B6ACA6",
  shade500: "#978F8A",
  shade600: "#564E4A",
  shade700: "#3C3836",
  shade800: "#191015",
  shade900: "#000000",

  primary100: "#fbd1d3",
  primary200: "#f4767b",
  primary300: "#f26065",
  primary400: "#f0494f",
  primary500: "#ee3239",
  primary600: "#ed1c24",

  secondary100: "#edeef4",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#e64b47",
  angry500: "#e01f1a",

  success100: "#cbead6",
  success500: "#82CDB1",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const;

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral500,
  /**
   * Inactive views
   */
  disabled: palette.neutral300,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default color of the views atop background.
   */
  surface: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.shade300,
  borderLight: palette.shade200,
  /**
   * The main tinting color of icons.
   */
  tint: palette.primary500,
  /**
   * Main branding color.
   */
  primary: palette.primary600,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   *
   */
  success: palette.success500,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
  /**
   * Modal background
   */
  underlay: "rgba(0,0,0,0.1)",
};

export const avatarColors = [
  "#FF1744",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#1abc9c",
  "#009688",
  "#2ecc71",
  "#FFD217",
  "#ff9800",
  "#ff5722",
];
