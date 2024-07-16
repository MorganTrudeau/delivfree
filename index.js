import Bugsnag from "@bugsnag/react-native";
Bugsnag.start();

// import "./wdyr";
import "react-native-gesture-handler";
import App from "./app/app.tsx";
import { AppRegistry } from "react-native";

AppRegistry.registerComponent("delivfree", () => App);

export default App;
