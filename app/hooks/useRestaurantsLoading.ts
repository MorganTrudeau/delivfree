import { useCallback, useEffect, useRef, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Cuisine, Vendor, RestaurantLocation } from "delivfree";
import { fetchRestaurants } from "app/apis/restaurants";
import { useAppSelector } from "app/redux/store";

const PAGE_SIZE = 15;

export const useRestaurantsLoading = (cuisine: Cuisine) => {
  const cache = useRef(getRestaurantCache());

  const activeUser = useAppSelector((state) => state.user.user);

  const [restaurants, setRestaurants] = useState<RestaurantLocation[]>(
    cache.current.listCache[cuisine]
  );

  const page = useRef(0);

  const loadRestaurants = useCallback(async () => {
    page.current = page.current + 1;
    const limit = page.current * PAGE_SIZE;
    const restaurants = await fetchRestaurants(
      {
        latitude: activeUser?.location?.latitude as number,
        longitude: activeUser?.location?.longitude as number,
      },
      { cuisine, limit }
    );
    setRestaurants(restaurants);
    cache.current.updateCache(cuisine, restaurants);
  }, [cuisine]);

  useEffect(() => {
    setRestaurants(cache.current.listCache[cuisine]);
    loadRestaurants();
  }, [loadRestaurants, cuisine]);

  return { restaurants, loadRestaurants };
};

let _restaurantCache: RestaurantCache;
export const getRestaurantCache = () => {
  if (!_restaurantCache) {
    _restaurantCache = new RestaurantCache();
  }
  return _restaurantCache;
};
class RestaurantCache {
  cache: { [id: string]: RestaurantLocation } = {};
  listCache: { [cuisine: string]: RestaurantLocation[] } = {};
  updateCache = (cuisine: string, data: RestaurantLocation[]) => {
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
