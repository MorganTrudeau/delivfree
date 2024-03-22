import { useAppDispatch } from "app/redux/store";
import firestore from "@react-native-firebase/firestore";
import { setConfig } from "app/redux/reducers/appConfig";
import { useEffect } from "react";
import { AppConfig } from "delivfree";

export const DataLoading = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadAppConfig = async () => {
      try {
        const appConfigDoc = await firestore()
          .collection("AppConfig")
          .doc("config")
          .get();
        const appConfig = appConfigDoc.data() as AppConfig;
        console.log("APP CONFIG", appConfig);
        dispatch(setConfig(appConfig));
      } catch (error) {
        console.log("Failed to load app config: ", error);
      }
    };
    loadAppConfig();
  });

  return null;
};
