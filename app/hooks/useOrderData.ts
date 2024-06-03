import { Order } from "delivfree";
import { DataCache, useDataListener } from "./useDataLoading";
import { useCallback } from "react";
import { listenToOrders } from "app/apis/orders";

const cache = new DataCache<Order>();

export const useOrderData = (
  vendor: string | undefined,
  vendorLocation: string | undefined
) => {
  const handleLoadOrders = useCallback(
    (limit: number, onData: (orders: Order[]) => void) => {
      if (!(vendor && vendorLocation)) {
        return () => {};
      }
      return listenToOrders(vendor, vendorLocation, limit, onData);
    },
    [vendor, vendorLocation]
  );

  const { data, loadData } = useDataListener<Order>(
    handleLoadOrders,
    cache,
    vendorLocation
  );

  return { data, loadData, cache };
};
