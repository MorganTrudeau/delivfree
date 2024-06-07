import { translate } from "app/i18n";
import { useCallback, useState } from "react";
import { useToast } from "./useToast";

export const useAsyncFunction = (
  asyncFunction: () => Promise<any>,
  memoize?: boolean
) => {
  const Toast = useToast();

  const [{ loading, error }, setState] = useState({
    loading: false,
    error: null as unknown,
  });

  const exec = async () => {
    try {
      setState({ loading: true, error: null });
      await asyncFunction();
      setState({ loading: false, error: null });
    } catch (error) {
      setState({ loading: false, error: error });
      console.log(`ERROR: ${asyncFunction.name}`, error);
      Toast.show(translate("errors.common"));
    }
  };

  const execMemo = useCallback(exec, [asyncFunction]);

  return { exec: memoize ? execMemo : exec, loading, error };
};
