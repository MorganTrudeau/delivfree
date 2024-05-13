import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Cuisine } from "delivfree";

type AdType = "general" | "checkout" | Cuisine;
type AdCache = {
  [Property in AdType]: { image: string; title: string; text: string };
};

export const useAdBanner = () => {
  const [ads, setAds] = useState<Partial<AdCache>>(
    getAdBannerCache().getAdCache()
  );

  const loadAds = async () => {
    try {
      const adSnap = await firestore().collection("AdBanners").get();
      const _ads = adSnap.docs.reduce(
        (acc, doc) => ({
          ...acc,
          [doc.id]: doc.data(),
        }),
        {} as AdCache
      );
      getAdBannerCache().setAdCache(_ads);
      setAds(_ads);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadAds();
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
