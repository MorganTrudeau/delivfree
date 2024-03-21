import Bugsnag from "@bugsnag/react-native";
import "react-native-gesture-handler";

// This is the first file that ReactNative will run when it starts up.
// If you use Expo (`yarn expo:start`), the entry point is ./App.js instead.
// Both do essentially the same thing.

// import "./wdyr";

import App from "./app/app.tsx";
import React from "react";
import { AppRegistry } from "react-native";
Bugsnag.start();

function IgniteApp() {
  return <App />;
}

AppRegistry.registerComponent("delivfree", () => IgniteApp);
export default App;
