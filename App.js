// This is the entry point if you run `yarn expo:start`
// If you run `yarn ios` or `yarn android`, it'll use ./index.js instead.
import App from "./app/app.tsx";
import React from "react";
import { registerRootComponent } from "expo";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { initFirebase } from "./app/web/modules/firebase/initWeb.web.js";

SplashScreen.preventAutoHideAsync();

function IgniteApp() {
  return <App />;
}

if (Platform.OS !== "web") {
  registerRootComponent(IgniteApp);
} else {
  initFirebase();
}

export default IgniteApp;
