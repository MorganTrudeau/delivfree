import { Order } from "delivfree";
import { DataCache, useDataListener } from "./useDataLoading";
import { useCallback } from "react";
import { OrderListenerParams, listenToOrders } from "app/apis/orders";

const cache = new DataCache<Order>();

export const useOrderData = (params: Omit<OrderListenerParams, "limit">) => {
  const { vendorLocation, driver } = params;

  const handleLoadOrders = useCallback(
    (limit: number, onData: (orders: Order[]) => void) => {
      if (
        (params.hasOwnProperty("vendorLocation") && !vendorLocation) ||
        (params.hasOwnProperty("driver") && !driver)
      ) {
        return () => {};
      }
      return listenToOrders(onData, { vendorLocation, driver, limit });
    },
    [vendorLocation, driver]
  );

  const { data, loadData } = useDataListener<Order>(
    handleLoadOrders,
    cache,
    vendorLocation
  );

  return { data, loadData, cache };
};
