import React, { useMemo } from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

export const useLoadingIndicator = (
  loading: boolean,
  props?: ActivityIndicatorProps
) => {
  return useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} {...props} />
        : undefined,
    [loading]
  );
};
