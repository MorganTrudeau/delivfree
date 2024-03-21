// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#fcf1ea",
  neutral200: "#fbebe1",
  neutral300: "#eed0bf",
  neutral400: "#6f5241",
  neutral500: "#594134",
  neutral600: "#423127",
  neutral700: "#2c201a",
  neutral800: "#16100d",
  neutral900: "#000000",

  shade100: "#FFFFFF",
  shade200: "#F4F2F1",
  shade300: "#D7CEC9",
  shade400: "#B6ACA6",
  shade500: "#978F8A",
  shade600: "#564E4A",
  shade700: "#3C3836",
  shade800: "#191015",
  shade900: "#000000",

  primary100: "#e4b195",
  primary200: "#dfa483",
  primary300: "#db9772",
  primary400: "#d68a60",
  primary500: "#d27e4f",
  primary600: "#cd6f3b",

  secondary100: "#DCDDE9",
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

  success100: "#82CDB1",

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
  surface: palette.primary200,
  /**
   * The default border color.
   */
  border: palette.primary400,
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
  success: palette.success100,
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
