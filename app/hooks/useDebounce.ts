import { useRef } from "react";

export const useDebounce = (wait: number) => {
  const lastCalled = useRef(0);

  return (func: (() => any) | ((args: void) => void)) => {
    return () => {
      const now = Date.now();
      if (now - lastCalled.current < wait) {
        return;
      }
      lastCalled.current = now;
      func();
    };
  };
};
