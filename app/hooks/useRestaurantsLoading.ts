import { useCallback, useEffect, useRef, useState } from "react";
import { CuisineId, VendorLocation } from "delivfree";
import { fetchVendorLocations } from "app/apis/vendorLocations";
import { useAppSelector } from "app/redux/store";

const PAGE_SIZE = 15;

export const useRestaurantsLoading = (cuisine: CuisineId) => {
  const cache = useRef(getRestaurantCache());

  const activeUser = useAppSelector((state) => state.user.user);

  const [restaurants, setRestaurants] = useState<VendorLocation[]>(
    cache.current.listCache[cuisine]
  );

  const page = useRef(0);

  const loadRestaurants = useCallback(async () => {
    page.current = page.current + 1;
    const limit = page.current * PAGE_SIZE;
    const restaurants = await fetchVendorLocations(
      {
        latitude: activeUser?.location?.latitude as number,
        longitude: activeUser?.location?.longitude as number,
      },
      { cuisine, limit },
      undefined,
      !!activeUser?.isTester
    );
    setRestaurants(restaurants);
    cache.current.updateCache(cuisine, restaurants);
  }, [cuisine]);

  const refreshRestaurants = useCallback(() => {
    page.current = 0;
    loadRestaurants();
  }, [loadRestaurants]);

  useEffect(() => {
    setRestaurants(cache.current.listCache[cuisine]);
    loadRestaurants();
  }, [loadRestaurants, cuisine]);

  return { restaurants, loadRestaurants, refreshRestaurants };
};

let _restaurantCache: RestaurantCache;
export const getRestaurantCache = () => {
  if (!_restaurantCache) {
    _restaurantCache = new RestaurantCache();
  }
  return _restaurantCache;
};
class RestaurantCache {
  cache: { [id: string]: VendorLocation } = {};
  listCache: { [cuisine: string]: VendorLocation[] } = {};
  updateCache = (cuisine: string, data: VendorLocation[]) => {
    this.listCache[cuisine] = data;
    this.cache = {
      ...this.cache,
      ...data.reduce(
        (acc, restaurant) => ({ ...acc, [restaurant.id]: restaurant }),
        {}
      ),
    };
  };
}
