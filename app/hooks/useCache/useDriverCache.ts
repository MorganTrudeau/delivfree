import { Driver } from "delivfree";
import { DataCache } from "../useData/useDataLoading";
import { useEffect, useState } from "react";
import { fetchDriver } from "app/apis/driver";

const cache = new DataCache<Driver>();

export const useDriverCache = (id: string | null | undefined) => {
  const [driver, setDriver] = useState<Driver | undefined>(
    id ? cache.cache[id] : undefined
  );

  useEffect(() => {
    if (!driver && id) {
      const loadVendorLocation = async () => {
        try {
          const data = await fetchDriver(id);
          if (data) {
            setDriver(data);
          }
        } catch (error) {
          console.log("Failed to load vendor location", error);
        }
      };
      loadVendorLocation();
    } else if (!id && driver) {
      setDriver(undefined);
    }
  }, [id]);

  return driver;
};
