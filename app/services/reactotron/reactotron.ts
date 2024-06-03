// @ts-nocheck

import { reactotronRedux } from "reactotron-redux";
import Reactotron from "reactotron-react-native";

const reactotron = Reactotron.configure({ name: "React Native Demo" })
  .use(reactotronRedux())
  .connect();

export default reactotron;
