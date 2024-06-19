import { translate } from "app/i18n";
import { useCallback, useState } from "react";
import { useToast } from "./useToast";

export const useAsyncFunction = <A, P>(
  asyncFunction: (args: A) => Promise<P>,
  memoize?: boolean
) => {
  const Toast = useToast();

  const [{ loading, error }, setState] = useState({
    loading: false,
    error: null as unknown,
  });

  const exec = async (args: A) => {
    try {
      setState({ loading: true, error: null });
      await asyncFunction(args as any);
      setState({ loading: false, error: null });
    } catch (error) {
      setState({ loading: false, error });
      console.log(`ERROR: ${asyncFunction.name}`, error);
      Toast.show(translate("errors.common"));
    }
  };

  const execMemo = useCallback(exec, [asyncFunction]);

  return { exec: memoize ? execMemo : exec, loading, error };
};
