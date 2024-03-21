import auth from "@react-native-firebase/auth";
import { useEffect, useRef } from "react";
import { setAnonymous, setAuthToken } from "app/redux/reducers/auth";
import { useAppDispatch } from "app/redux/store";
import { getListenersManager } from "app/utils/ListenersManager";
import crashlytics from "@react-native-firebase/crashlytics";
import { resetAppState } from "app/redux/resetAppState";
import { logAnalytics } from "./analytics";

export const FirebaseAuth = () => {
  const authToken = useRef<string>();

  const dispatch = useAppDispatch();

  const loginCrashlytics = async (userId: string) => {
    try {
      await crashlytics().setUserId(userId);
    } catch (error) {
      console.log("Failed to login crashlytics: ", error);
    }
  };

  useEffect(() => {
    const listener = auth().onAuthStateChanged((user) => {
      console.log("Firebase auth user: ", user);
      if (user) {
        if (authToken.current !== user.uid) {
          authToken.current = user.uid;
          loginCrashlytics(user.uid);
          dispatch(setAuthToken(user.uid));
          dispatch(setAnonymous(user.isAnonymous));
          logAnalytics("signin");
        }
      } else {
        authToken.current = undefined;
        getListenersManager().removeAllListeners();
        dispatch(setAuthToken(undefined));
        setTimeout(() => dispatch(resetAppState()), 200);
      }
    });

    return () => {
      listener();
    };
  }, []);

  return null;
};
