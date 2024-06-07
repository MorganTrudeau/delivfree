import { Driver, Status } from "delivfree";
import { useDataListener } from "./useDataLoading";
import { useCallback } from "react";
import { useAppDispatch } from "app/redux/store";
import { setDrivers } from "app/redux/reducers/driver";
import { listenToDrivers } from "app/apis/driver";

export const useDriverData = (
  params: { vendor?: string; status?: Status } = {}
) => {
  const { vendor, status } = params;

  const dispatch = useAppDispatch();

  const handleLoadDriver = useCallback(
    (limit: number, onData: (orders: Driver[]) => void) => {
      return listenToDrivers(
        (drivers) => {
          onData(Object.values(drivers));
          dispatch(setDrivers(drivers));
        },
        { limit, status }
      );
    },
    [vendor, status]
  );

  const { data, loadData } = useDataListener(handleLoadDriver);

  return { data, loadData };
};
