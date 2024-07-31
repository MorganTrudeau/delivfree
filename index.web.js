// // import Bugsnag from "@bugsnag/react-native";
// import "react-native-gesture-handler";
// import App from "./app/app.tsx";
// import { initFirebase } from "./app/web/modules/firebase/initWeb.web.js";
// import { registerRootComponent } from "expo";
// // Bugsnag.start();



// registerRootComponent(App);
// initFirebase();

// export default App;


import "react-native-gesture-handler";
import { initFirebase } from "./app/web/modules/firebase/initWeb.web.js";
import { AppRegistry } from 'react-native';
import App from "./app/app.tsx";

const { name } = require('./app.json');

AppRegistry.registerComponent(name, () => App);

initFirebase();

if (module.hot) {
  module.hot.accept();
}

AppRegistry.runApplication(name, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
