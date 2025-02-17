import auth from "@react-native-firebase/auth";
import { useEffect, useRef } from "react";
import {
  setAnonymous,
  setAuthToken,
  setAuthUser,
} from "app/redux/reducers/auth";
import { setUser } from "app/redux/reducers/user";
import { useAppDispatch } from "app/redux/store";
import { getListenersManager } from "app/utils/ListenersManager";
import crashlytics from "@react-native-firebase/crashlytics";
import { resetAppState } from "app/redux/resetAppState";
import { logAnalytics } from "./analytics";
import { listenToUser } from "app/apis/user";
import { getAppType } from "app/utils/general";
import { setVendor } from "app/redux/reducers/vendor";
import { setActiveDriver } from "app/redux/reducers/driver";
import Bugsnag from "@bugsnag/react-native";

export const FirebaseAuth = () => {
  const authToken = useRef<string>();

  const dispatch = useAppDispatch();

  const loginCrashReports = async (userId: string) => {
    try {
      await crashlytics().setUserId(userId);
      Bugsnag.setUser(userId);
    } catch (error) {
      console.log("Failed to login crashlytics: ", error);
    }
  };

  useEffect(() => {
    const listener = auth().onAuthStateChanged((user) => {
      if (user) {
        if (authToken.current !== user.uid) {
          authToken.current = user.uid;
          loginCrashReports(user.uid);
          dispatch(setAuthToken(user.uid));
          dispatch(
            setAuthUser({
              email: user.email,
              uid: user.uid,
              emailVerified: user.emailVerified,
            })
          );
          dispatch(setAnonymous(user.isAnonymous));
          listenToUser(user.uid, (user) => {
            dispatch(setUser(user));
            if (getAppType() === "VENDOR") {
              if (!user?.vendor) {
                dispatch(setVendor(null));
              }
              if (!user?.driver) {
                dispatch(setActiveDriver(null));
              }
            }
          });
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
