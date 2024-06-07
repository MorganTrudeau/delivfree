import "./i18n";
import "./utils/ignoreWarnings";
import { useFonts } from "expo-font";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./navigators";
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary";
import { customFontsToLoad } from "./theme";
import Config from "./config";
import { FirebaseAuth } from "./services/firebase/auth";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { $flex } from "./components/styles";
import ToastProvider from "./components/Toast/ToastContext";
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import LocalWebNotificationProvider from "app/context/LocalWebNotificationContext";

// Use a local emulator in development
import functions from "@react-native-firebase/functions";
import { isEmulatorSync } from "react-native-device-info";
import PopoverProvider from "./components/Popover/PopoverContext";
import { ListTabs } from "./components/Tabs";
import { Text } from "./components";

if (__DEV__ && isEmulatorSync()) {
  // If you are running on a physical device, replace http://localhost with the local ip of your PC. (http://192.168.x.x)
  console.log("Using function emulator");
  functions().useEmulator("http://localhost", 5001);
}

// @ts-ignore
TouchableOpacity.defaultProps = {
  activeOpacity: 0.9,
};
// @ts-ignore
FlatList.showsVerticalScrollIndicator = false;

/**
 * This is the root component of our app.
 */
function App() {
  const [fontsLoaded] = useFonts(customFontsToLoad);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {fontsLoaded && (
          <GestureHandlerRootView style={$rootView}>
            <SafeAreaProvider>
              <ErrorBoundary catchErrors={Config.catchErrors}>
                <ToastProvider>
                  <PopoverProvider>
                    <LocalWebNotificationProvider>
                      <AppNavigator />
                      <FirebaseAuth />
                    </LocalWebNotificationProvider>
                  </PopoverProvider>
                </ToastProvider>
              </ErrorBoundary>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        )}
      </PersistGate>
    </Provider>
  );
}

const $rootView: ViewStyle = { flex: 1, overflow: "hidden" };

export default App;
