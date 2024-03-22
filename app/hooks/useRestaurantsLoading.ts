import { useCallback, useEffect, useRef, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Restaurant } from "delivfree";

const PAGE_SIZE = 15;

export const useRestaurantsLoading = (cuisine: string) => {
  const cache = useRef(getRestaurantCache());

  const [restaurants, setRestaurants] = useState<Restaurant[]>(
    cache.current.cache[cuisine]
  );

  const page = useRef(0);

  const loadRestaurants = useCallback(async () => {
    page.current = page.current + 1;
    const snap = await firestore()
      .collection("Restaurants")
      .where("cuisine", "array-contains", cuisine)
      .limit(page.current * PAGE_SIZE)
      .get();
    const data = snap.docs.map((doc) => doc.data() as Restaurant);
    setRestaurants(data);
    cache.current.updateCache(cuisine, data);
  }, [cuisine]);

  useEffect(() => {
    setRestaurants(cache.current.cache[cuisine]);
    loadRestaurants();
  }, [loadRestaurants, cuisine]);

  return { restaurants, loadRestaurants };
};

let _restaurantCache: RestaurantCache;
const getRestaurantCache = () => {
  if (!_restaurantCache) {
    _restaurantCache = new RestaurantCache();
  }
  return _restaurantCache;
};
class RestaurantCache {
  cache: { [cuisine: string]: Restaurant[] } = {};
  updateCache = (cuisine: string, data: Restaurant[]) => {
    this.cache[cuisine] = data;
  };
}
