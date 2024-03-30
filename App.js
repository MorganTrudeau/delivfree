// This is the entry point if you run `yarn expo:start`
// If you run `yarn ios` or `yarn android`, it'll use ./index.js instead.
import App from "./app/app.tsx";
import { registerRootComponent } from "expo";
import { Platform } from "react-native";
import { initFirebase } from "./app/web/modules/firebase/initWeb.web.js";

if (Platform.OS !== "web") {
  AppRegistry.registerComponent("delivfree", () => App);
} else {
  registerRootComponent(App);
  initFirebase();
}

export default App;
