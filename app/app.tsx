import "./i18n";
import "./utils/ignoreWarnings";
import { useFonts } from "expo-font";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator, AppStackParamList } from "./navigators";
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
import { LinkingOptions, getStateFromPath } from "@react-navigation/native";
import { extractQueryParams } from "./utils/general";
import { DataLoading } from "./services/firebase/firestore";

// Use a local emulator in development
import functions from "@react-native-firebase/functions";
import { isEmulatorSync } from "react-native-device-info";
import { initAppsflyer } from "./utils/appsflyer";

if (__DEV__ && isEmulatorSync()) {
  // If you are running on a physical device, replace http://localhost with the local ip of your PC. (http://192.168.x.x)
  console.log("Using function emulator");
  functions().useEmulator("http://localhost", 5001);
}

initAppsflyer();

// @ts-ignore
TouchableOpacity.defaultProps = {
  activeOpacity: 0.9,
};

// Web linking configuration
const prefixes = [
  "smarticus://",
  "https://smarticus.app",
  "http://smarticus.app",
  "https://www.smarticus.app",
  "http://www.smarticus.app",
  "https://smarticus.onelink.me/0hhT",
];
const config = {
  initialRouteName: "Tabs",
  screens: {
    StartChallenge: {
      path: "create-challenge",
    },
  },
} as const;

/**
 * This is the root component of our app.
 */
function App() {
  const [fontsLoaded] = useFonts(customFontsToLoad);

  const linking: LinkingOptions<AppStackParamList> = {
    prefixes,
    config,
    getStateFromPath: (path, options) => {
      const { path: urlPath, params } = extractQueryParams(path);

      let constructedPath = "";

      const { deep_link_value, userId } = params;

      console.log({ path, urlPath, deep_link_value, userId });

      if (
        (urlPath === "ol2mm3ha" || deep_link_value === "create-challenge") &&
        userId
      ) {
        constructedPath = `create-challenge?userId=${userId}`;
      }

      return getStateFromPath(constructedPath, options);
    },
  };

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
                      <AppNavigator linking={linking} />
                    </PortalHost>
                  </PortalHost>
                  <FirebaseAuth />
                  <DataLoading />
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
