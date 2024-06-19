import { Status, Vendor } from "delivfree";
import { useDataListener } from "./useDataLoading";
import { useCallback } from "react";
import { listenToVendors } from "app/apis/vendors";
import { useAppDispatch } from "app/redux/store";
import { setVendors } from "app/redux/reducers/vendor";
import { hasValidParams } from "./utils";

export const useVendorData = (params: { status?: Status } = {}) => {
  const { status } = params;

  const dispatch = useAppDispatch();

  const handleLoadVendor = useCallback(
    (limit: number, onData: (orders: Vendor[]) => void) => {
      if (!hasValidParams(params)) {
        return () => {};
      }
      return listenToVendors(
        (vendors) => {
          onData(Object.values(vendors));
          dispatch(setVendors(vendors));
        },
        { limit, status }
      );
    },
    [status]
  );

  const { data, loadData } = useDataListener<Vendor>(handleLoadVendor);

  return { data, loadData };
};
