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
import { Host as PortalHost } from "react-native-portalize";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { $flex } from "./components/styles";
import ToastProvider from "./components/Toast/ToastContext";
import { TouchableOpacity } from "react-native";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Use a local emulator in development
import functions from "@react-native-firebase/functions";
import { isEmulatorSync } from "react-native-device-info";
import AlertProvider from "./components/Alert/AlertContext";

if (__DEV__ && isEmulatorSync()) {
  // If you are running on a physical device, replace http://localhost with the local ip of your PC. (http://192.168.x.x)
  console.log("Using function emulator");
  functions().useEmulator("http://localhost", 5001);
}

// @ts-ignore
TouchableOpacity.defaultProps = {
  activeOpacity: 0.9,
};

/**
 * This is the root component of our app.
 */
function App() {
  const [fontsLoaded] = useFonts(customFontsToLoad);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {fontsLoaded && (
          <GestureHandlerRootView style={$flex}>
            <SafeAreaProvider>
              <ErrorBoundary catchErrors={Config.catchErrors}>
                <ToastProvider>
                  <PortalHost>
                    <PortalHost>
                      <AlertProvider>
                        <AppNavigator />
                      </AlertProvider>
                    </PortalHost>
                  </PortalHost>
                  <FirebaseAuth />
                </ToastProvider>
              </ErrorBoundary>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        )}
      </PersistGate>
    </Provider>
  );
}

export default App;
