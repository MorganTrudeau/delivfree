import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export const COINS_DISCOUNT_DELAY_ASYNC_KEY = "coins_discount_delay_async_key";
export const COUNTS_DISCOUNT_DELAY_COUNT = 1;

export const DELAY_SHOWN_VALUE = "SHOWN";

export const useDelayedShow = (
  asyncKey: string,
  delayCount: number,
  onShow: () => void
) => {
  const setShown = async () => {
    try {
      await AsyncStorage.setItem(asyncKey, DELAY_SHOWN_VALUE);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const shouldShow = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(asyncKey);

        console.log(savedValue);

        if (savedValue === DELAY_SHOWN_VALUE) {
          return;
        }

        const count =
          savedValue && !isNaN(Number(savedValue)) ? Number(savedValue) : 0;

        if (count >= delayCount) {
          setShown();
          return onShow();
        }

        await AsyncStorage.setItem(asyncKey, String(count + 1));
      } catch (error) {
        console.log(error);
      }
    };
    shouldShow();
  }, []);

  return { setShown };
};
