import { Platform, useWindowDimensions } from "react-native";

export const useHeaderHeight = (): number => {
  const dimensions = useWindowDimensions();

  let headerHeight = Platform.OS === "android" ? 56 : 64;

  if (Platform.OS === "ios") {
    const isLandscape = dimensions.width > dimensions.height;

    if (Platform.isPad || Platform.isTV) {
      headerHeight = 50;
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        headerHeight = 44;
      }
    }
  }

  return headerHeight;
};
