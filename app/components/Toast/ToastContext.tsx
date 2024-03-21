import React, { createContext, useCallback, useMemo, useState } from "react";
import Toast from "./Toast";

/* eslint-disable */
export const ToastContext = createContext({
  show: (text: string, duration?: number) => {},
});
/* eslint-enable */

const initialState = { visible: false, text: "" };

type Props = {
  children: React.ReactNode | React.ReactNode[];
  topOffset?: number;
};

const ToastProvider = ({ children, topOffset }: Props) => {
  const [state, setState] = useState(initialState);
  const { visible, text } = state;

  const show = useCallback((_text: string, duration?: number) => {
    setState({ text: _text, visible: true });
    setTimeout(() => setState(initialState), duration || 3000);
  }, []);

  const contextValue = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast {...{ visible, text, topOffset }} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
