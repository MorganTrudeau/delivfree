// import Bugsnag from "@bugsnag/react-native";
import "react-native-gesture-handler";

// This is the first file that ReactNative will run when it starts up.
// If you use Expo (`yarn expo:start`), the entry point is ./App.js instead.
// Both do essentially the same thing.

// import "./wdyr";

import App from "./app/app.tsx";
import { AppRegistry } from "react-native";
import { initFirebase } from "./app/web/modules/firebase/initWeb.web.js";
import { registerRootComponent } from "expo";
// Bugsnag.start();

// if (Platform.OS !== "web") {
//   registerRootComponent(IgniteApp);
// } else {
//   initFirebase();
// }
registerRootComponent(App);
initFirebase();
// AppRegistry.registerComponent("delivfree", () => App);
export default App;
