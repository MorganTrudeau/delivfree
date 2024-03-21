import { useEffect, useRef } from "react";

export const useThrottle = () => {
  const timeout = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      timeout.current && clearTimeout(timeout.current);
    };
  }, []);

  return (func: (() => any) | ((args: void) => void), delay: number) => {
    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(func, delay);
  };
};
