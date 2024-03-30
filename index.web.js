// import Bugsnag from "@bugsnag/react-native";
import "react-native-gesture-handler";
import App from "./app/app.tsx";
import { initFirebase } from "./app/web/modules/firebase/initWeb.web.js";
import { registerRootComponent } from "expo";
// Bugsnag.start();

registerRootComponent(App);
initFirebase();

export default App;
