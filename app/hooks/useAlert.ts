import { AlertContext } from "app/components/Alert/AlertContext";
import { useContext } from "react";

export const useAlert = () => {
  return useContext(AlertContext);
};
