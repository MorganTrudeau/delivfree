import { useAppSelector } from "app/redux/store";
import { getAdMob } from "app/services/admob/Admob";
import { useRef } from "react";

export const useAdMob = () => {
  const appConfig = useAppSelector((state) => state.appConfig.config);

  const adMob = useRef(getAdMob(appConfig)).current;

  // const [rewardedAdReady, setRewardedAdReady] = useState(adMob.rewardedAdReady);
  // const [interstitialAdReady, setInterstitialAdReady] = useState(
  //   adMob.interstitialAdReady
  // );

  // useEffect(() => {
  //   const unsubscribeRewardedReady =
  //     adMob.listenToRewardedAdReady(setRewardedAdReady);
  //   const unsubscribeInterstitialReady = adMob.listenToRewardedAdReady(
  //     setInterstitialAdReady
  //   );

  //   return () => {
  //     unsubscribeRewardedReady();
  //     unsubscribeInterstitialReady();
  //   };
  // }, []);

  return adMob;
};
