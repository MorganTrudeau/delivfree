import { createContext } from "react";
import { AlertButton } from "react-native";

export const AlertContext = createContext({
  alert: (
    title: string,
    message: string,
    buttons?: AlertButton[],
    props?: any
  ) => {},
});
