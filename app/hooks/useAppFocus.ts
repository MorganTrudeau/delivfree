import { useEffect } from "react";
import { AppState, Platform } from "react-native";

export const useAppFocus = (onFocus: () => void) => {
  useEffect(() => {
    if (Platform.OS === "android") {
      const subscription = AppState.addEventListener("focus", (state) => {
        onFocus();
      });
      return () => subscription.remove();
    } else {
      let lastState = AppState.currentState;
      const subscription = AppState.addEventListener("change", (state) => {
        if (lastState !== "active" && state === "active") {
          onFocus();
        }
        lastState = state;
      });
      return () => subscription.remove();
    }
  }, [onFocus]);
};
