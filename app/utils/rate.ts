import Rate, { AndroidMarket } from "react-native-rate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COINS_DISCOUNT_DELAY_ASYNC_KEY, DELAY_SHOWN_VALUE } from "app/hooks";
import { getAppType } from "./general";

const HAS_RATED = "has-rated-async";
const DEFER_RATING_VALUE = "defer-rating";
const HAS_RATED_VALUE = "has-rated";

export const shouldAskRating = async () => {
  try {
    const res = await AsyncStorage.getItem(HAS_RATED);
    if (!res) {
      await AsyncStorage.setItem(HAS_RATED, DEFER_RATING_VALUE);
      return false;
    } else if (res === DEFER_RATING_VALUE) {
      const hasShownCoinSale = await AsyncStorage.getItem(
        COINS_DISCOUNT_DELAY_ASYNC_KEY
      );
      return hasShownCoinSale === DELAY_SHOWN_VALUE;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Failed to check has rated: ", error);
    return false;
  }
};

export const setHasRated = async () => {
  try {
    await AsyncStorage.setItem(HAS_RATED, HAS_RATED_VALUE);
  } catch (error) {
    console.log("Failed to set has rated: ", error);
  }
};

const appsIds = {
  VENDOR: "6596782754",
  CONSUMER: "6596782879",
};
const packageIds = {
  VENDOR: "com.delivfree.vendor",
  CONSUMER: "com.delivfree.consumer",
};

export const rateApp = (
  preferInApp = false,
  callback?: (success: boolean, errorMessage: string) => void
) => {
  const appType = getAppType();
  const appleAppId = appsIds[appType];
  const packageId = packageIds[appType];

  const options = {
    AppleAppID: appleAppId,
    GooglePackageName: packageId,
    preferredAndroidMarket: AndroidMarket.Google,
    preferInApp,
    openAppStoreIfInAppFails: !preferInApp,
  };

  Rate.rate(options, (success, errorMessage) => {
    console.log(success, errorMessage);
    if (success) {
      setHasRated();
    }
    if (errorMessage) {
      console.log(`Example page Rate.rate() error: ${errorMessage}`);
    }
    callback && callback(success, errorMessage);
  });
};
