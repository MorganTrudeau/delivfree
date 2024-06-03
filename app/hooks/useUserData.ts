import { User } from "delivfree";
import { useDataListener, DataCache } from "./useDataLoading";
import { useCallback } from "react";
import { listenToUsers } from "app/apis/user";

const cache = new DataCache<User>();

export const useUserData = () => {
  const handleLoadVendor = useCallback(
    (limit: number, onData: (orders: User[]) => void) => {
      return listenToUsers(limit, onData);
    },
    []
  );

  const { data, loadData } = useDataListener<User>(handleLoadVendor, cache);

  return { data, loadData, cache };
};
