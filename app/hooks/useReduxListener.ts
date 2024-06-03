import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";

export const useReduxListener = (listener) => {
  useEffect(() => {
    let unsubscribe = () => {};

    const subscribeListener = async () => {
      unsubscribe = await listener().then(unwrapResult);
    };
    subscribeListener();

    return unsubscribe;
  }, [listener]);
};
