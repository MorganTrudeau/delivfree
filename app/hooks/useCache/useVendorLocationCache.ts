import { VendorLocation } from "delivfree";
import { DataCache } from "../useData/useDataLoading";
import { useEffect, useState } from "react";
import { fetchVendorLocation } from "app/apis/vendorLocations";

const cache = new DataCache<VendorLocation>();

export const useVendorLocationCache = (id: string) => {
  const [vendorLocation, setVendorLocation] = useState<VendorLocation>(
    cache.cache[id]
  );

  useEffect(() => {
    if (!vendorLocation) {
      const loadVendorLocation = async () => {
        try {
          const data = await fetchVendorLocation(id);
          if (data) {
            setVendorLocation(data);
          }
        } catch (error) {
          console.log("Failed to load vendor location", error);
        }
      };
      loadVendorLocation();
    }
  }, [id]);

  return vendorLocation;
};
