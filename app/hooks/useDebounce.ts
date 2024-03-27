import { useRef } from "react";

export const useDebounce = (wait: number) => {
  const lastCalled = useRef(0);

  return <F extends Function>(func: F) => {
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCalled.current < wait) {
        return;
      }
      lastCalled.current = now;
      func(...args);
    };
  };
};
