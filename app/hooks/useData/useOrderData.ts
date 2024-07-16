import { Order } from "delivfree";
import { DataCache, useDataListener } from "./useDataLoading";
import { useCallback } from "react";
import { OrderListenerParams, listenToOrders } from "app/apis/orders";
import { hasValidParams } from "./utils";

const cache = new DataCache<Order>();

export const useOrderData = (params: Omit<OrderListenerParams, "limit">) => {
  const { vendorLocation, driver, startDate, endDate } = params;

  const handleLoadOrders = useCallback(
    (limit: number, onData: (orders: Order[]) => void) => {
      if (!hasValidParams(params)) {
        return () => {};
      }
      return listenToOrders(onData, {
        vendorLocation,
        driver,
        limit,
        startDate,
        endDate,
      });
    },
    [vendorLocation, driver, startDate, endDate]
  );

  const { data, loadData } = useDataListener<Order>(
    handleLoadOrders,
    cache,
    vendorLocation
  );

  return { data, loadData, cache };
};
