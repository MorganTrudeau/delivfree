import { ForwardedRef, useCallback } from "react";

export const useCombinedRefs = <R>(...refs: ForwardedRef<R>[]) => {
  const setRef = useCallback((r: R) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(r);
      } else {
        ref.current = r;
      }
    });
  }, []);

  return setRef;
};
