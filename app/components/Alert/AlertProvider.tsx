import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, AlertButton, Platform } from "react-native";
import AppAlert from "./AppAlert";
import { ModalRef } from "app/utils/types";
import { AlertContext } from "./AlertContext";

export type AlertProps = {
  alert: (
    title: string,
    message: string,
    buttons?: AlertButton[],
    props?: any
  ) => void;
};

const defaultButtons = [{ text: "OK", onPress: () => {} }];

const defaultAlertProps = {
  buttons: defaultButtons,
  title: "",
  message: "",
  customContentRenderer: null,
  titleIcon: null,
  renderAfterHeader: null,
  tapToDismiss: false,
};

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const appAlert = useRef<ModalRef>(null);

  const [alertProps, setAlertProps] = useState(defaultAlertProps);

  const mobileAlert = useCallback(
    (title: string, message: string, buttons: AlertButton[] = defaultButtons) =>
      Alert.alert(title, message, buttons),
    []
  );

  const webAlert = useCallback(
    (title: string, message: string, _buttons?: AlertButton[], props?: any) => {
      const buttons = _buttons
        ? _buttons.reverse()
        : [{ text: "OK", onPress: () => {} }]; // Mobile buttons are in opposite order
      setAlertProps({ title, message, buttons, ...props });
      setTimeout(() => appAlert.current?.open(), 1);
    },
    []
  );

  const closeAlert = () => {
    appAlert.current?.close();
  };

  const value = useMemo(
    () => ({ alert: Platform.select({ web: webAlert, default: mobileAlert }) }),
    [mobileAlert, webAlert]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      {Platform.OS === "web" && (
        <AppAlert {...alertProps} ref={appAlert} onRequestClose={closeAlert} />
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
