import { ToastContext } from "app/components/Toast/ToastContext";
import { useContext } from "react";

export const useToast = () => {
  return useContext(ToastContext);
};
