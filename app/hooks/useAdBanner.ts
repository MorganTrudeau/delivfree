import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Cuisine } from "delivfree";

export type AdType = "general" | "checkout" | Cuisine;
export type AdConfig = { image: string; title: string; text: string };
export type AdCache = {
  [Property in AdType]?: AdConfig;
};

export const useAdBanner = () => {
  const [ads, setAds] = useState<Partial<AdCache>>(
    getAdBannerCache().getAdCache()
  );

  const loadAds = () => {
    return firestore()
      .collection("AdBanners")
      .onSnapshot((adSnap) => {
        const _ads = adSnap
          ? adSnap.docs.reduce(
              (acc, doc) => ({
                ...acc,
                [doc.id]: doc.data(),
              }),
              {} as AdCache
            )
          : {};
        getAdBannerCache().setAdCache(_ads);
        setAds(_ads);
      });
  };

  useEffect(() => {
    return loadAds();
  }, []);

  return ads;
};

let _adBannerCache: AdBannerCache;
const getAdBannerCache = () => {
  if (!_adBannerCache) {
    _adBannerCache = new AdBannerCache();
  }
  return _adBannerCache;
};
class AdBannerCache {
  private cache: Partial<AdCache> = {};

  getAdCache = () => {
    return this.cache;
  };

  setAdCache = (cache: Partial<AdCache>) => {
    this.cache = cache;
  };
}
