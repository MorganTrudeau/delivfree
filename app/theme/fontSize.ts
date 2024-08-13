import { TextStyle } from "react-native";

export const scaleSize = (size: number) => {
  return size;
};

export const fontSize = {
  xxl: {
    fontSize: scaleSize(30),
  } satisfies TextStyle,
  xl: {
    fontSize: scaleSize(24),
  } satisfies TextStyle,
  lg: {
    fontSize: scaleSize(20),
  } satisfies TextStyle,
  md: {
    fontSize: scaleSize(18),
  } satisfies TextStyle,
  sm: {
    fontSize: scaleSize(16),
  } satisfies TextStyle,
  xs: {
    fontSize: scaleSize(14),
  } satisfies TextStyle,
  xxs: {
    fontSize: scaleSize(12),
  } satisfies TextStyle,
};
