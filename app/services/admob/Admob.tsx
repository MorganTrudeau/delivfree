import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getEUAdConsent,
  initAdMob,
  requestAppTrackingTransparency,
} from "app/utils/adMob";
import { AppConfig } from "smarticus";
import { Platform, StatusBar } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import Bugsnag from "@bugsnag/react-native";
import { logAnalytics } from "../firebase/analytics";

let _adMob: AdMob;
export const getAdMob = (appConfig: AppConfig) => {
  if (!_adMob) {
    _adMob = new AdMob(appConfig);
  }
  return _adMob;
};

class AdMob {
  interstitialAdReady = false;
  rewardedAdReady = false;
  adsDisabled = false;

  interstialClosedCallback: (() => void) | undefined;
  rewardedEarnedCallback: (() => void) | undefined;

  adOptimization: AdOptimization;

  unsubscribeInterstitial: (() => void) | undefined;
  unsubscribeRewarded: (() => void) | undefined;

  rewardedAdReadyListeners = new Set<(ready: boolean) => void>();
  interstitialAdReadyListeners = new Set<(ready: boolean) => void>();

  constructor(appConfig: AppConfig) {
    this.adOptimization = new AdOptimization(appConfig);
    this.configAds();
  }

  private configAds = async () => {
    try {
      await initAdMob();

      const declinedConsent = await getEUAdConsent();

      if (declinedConsent === true) {
        this.adsDisabled = true;
      } else {
        await requestAppTrackingTransparency();
        this.attachAdListeners();
        interstitial.load();
        rewarded.load();
      }
    } catch (error) {
      console.log("Failed to config ads: ", error);
    }
  };

  shouldShowAd = () => this.adOptimization.shouldShowAd();

  setRewardedAdReadyStatus = (ready: boolean) => {
    this.rewardedAdReady = ready;
    this.rewardedAdReadyListeners.forEach((l) => l(ready));
  };

  setInterstitialAdReadyStatus = (ready: boolean) => {
    this.interstitialAdReady = ready;
    this.interstitialAdReadyListeners.forEach((l) => l(ready));
  };

  private attachAdListeners = () => {
    this.unsubscribeInterstitial = interstitial.addAdEventsListener(
      ({ type, payload }) => {
        if (type === AdEventType.OPENED) {
          this.adOptimization.recordAdShown();
          logAnalytics("ad_view_impression");
        }
        if (type === AdEventType.LOADED) {
          console.log("INTERSTITIAL LOADED");
          this.setInterstitialAdReadyStatus(true);
        }
        if (type === AdEventType.CLOSED) {
          StatusBar.setHidden(false);
          console.log("INTERSTITIAL CLOSED");
          if (typeof this.interstialClosedCallback === "function") {
            this.interstialClosedCallback();
            this.interstialClosedCallback = undefined;
          }
          setTimeout(() => interstitial.load(), 500);
        }
        if (type === AdEventType.ERROR && payload && payload instanceof Error) {
          Bugsnag.notify(payload);
        }
      }
    );

    this.unsubscribeRewarded = rewarded.addAdEventsListener(
      ({ type, payload }) => {
        if (type === AdEventType.OPENED) {
          this.adOptimization.recordAdShown();
          logAnalytics("ad_view_impression");
        }
        if (type === RewardedAdEventType.LOADED) {
          console.log("REWARDED LOADED");
          this.setRewardedAdReadyStatus(true);
        }
        if (type === AdEventType.CLOSED) {
          StatusBar.setHidden(false);
          console.log("REWARDED CLOSED");
          setTimeout(() => rewarded.load(), 500);
        }
        if (type === RewardedAdEventType.EARNED_REWARD) {
          console.log("REWARDED EARNED");
          if (typeof this.rewardedEarnedCallback === "function") {
            this.rewardedEarnedCallback();
            this.rewardedEarnedCallback = undefined;
          }
        }
        if (type === AdEventType.ERROR && payload && payload instanceof Error) {
          Bugsnag.notify(payload);
        }
      }
    );
  };

  showRewardedAd = (earnedCallback: () => void) => {
    const show = async () => {
      try {
        this.rewardedEarnedCallback = earnedCallback;
        StatusBar.setHidden(true);
        await rewarded.show();
        this.setRewardedAdReadyStatus(false);
      } catch (error) {
        console.log("Failed to show rewarded ad: ", error);
      }
    };

    if (this.rewardedAdReady) {
      show();
    }
  };

  showInterstitialAd = (closeCallback: () => void) => {
    const show = async () => {
      try {
        this.interstialClosedCallback = closeCallback;
        await interstitial.show();
        this.setInterstitialAdReadyStatus(false);
      } catch (error) {
        console.log("Failed to show interstitial ad: ", error);
      }
    };

    if (this.interstitialAdReady) {
      show();
    }
  };

  loadInterstitial = () => {
    interstitial.load();
  };

  loadRewardedAd = () => {
    rewarded.load();
  };

  listenToRewardedAdReady = (l: (ready: boolean) => void) => {
    this.rewardedAdReadyListeners.add(l);
    return () => this.rewardedAdReadyListeners.delete(l);
  };

  listenToInterstitialAdReady = (l: (ready: boolean) => void) => {
    this.interstitialAdReadyListeners.add(l);
    return () => this.interstitialAdReadyListeners.delete(l);
  };
}

const interstitialAdUnit = __DEV__
  ? TestIds.INTERSTITIAL
  : (Platform.select({
      ios: "ca-app-pub-6154128464262377/4112640133",
      android: "ca-app-pub-6154128464262377/5652172261",
    }) as string);

const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnit);

const rewardedAdUnit = __DEV__
  ? TestIds.REWARDED
  : (Platform.select({
      ios: "ca-app-pub-6154128464262377/2883899505",
      android: "ca-app-pub-6154128464262377/4196981171",
    }) as string);

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnit);

class AdOptimization {
  dataAsyncKey = "APP_OPTIMIZATION_DATA_ASYNC";
  adFrequencyMs = 300;
  gamesBeforeAd = 0;
  gamesBeforeAdResetMs = 3600;
  data = { lastAdShown: 0, lastGamePlayed: 0, gamesPlayed: 0 };

  constructor(config: AppConfig) {
    this.adFrequencyMs = config.adFrequencySeconds * 1000;
    this.gamesBeforeAd = config.gamesBeforeAd;
    this.gamesBeforeAdResetMs =
      config.gamesBeforeAdResetFrequencySeconds * 1000;
    this.loadData();
  }

  validateAsyncData(data: any) {
    return (
      data &&
      typeof data === "object" &&
      typeof data.lastAdShown === "number" &&
      !isNaN(data.lastAdShown) &&
      typeof data.gamesPlayed === "number" &&
      !isNaN(data.gamesPlayed) &&
      typeof data.lastGamePlayed === "number" &&
      !isNaN(data.lastGamePlayed)
    );
  }

  async loadData() {
    try {
      const dataJSON = await AsyncStorage.getItem(this.dataAsyncKey);
      if (!(dataJSON && typeof dataJSON === "string")) {
        return;
      }
      const data = JSON.parse(dataJSON);
      if (!this.validateAsyncData(data)) {
        return;
      }
      this.data = data;
    } catch (error) {
      console.log("Failed to load ad optimization data: ", error);
    }
  }

  async saveData() {
    try {
      const dataJSON = JSON.stringify(this.data);
      await AsyncStorage.setItem(this.dataAsyncKey, dataJSON);
    } catch (error) {
      console.log("Failed to load ad optimization data: ", error);
    }
  }

  setConfig(config: AppConfig) {
    this.adFrequencyMs = config.adFrequencySeconds * 1000;
    this.gamesBeforeAd = config.gamesBeforeAd;
  }

  recordAdShown() {
    this.data.lastAdShown = Date.now();
    this.saveData();
  }

  shouldShowAd() {
    const now = Date.now();

    console.log("DATA", this.data);

    // Check if has played a game
    // Reset games played if time elapsed since last game is greater than reset freq
    if (
      this.data.lastGamePlayed &&
      this.gamesBeforeAdResetMs &&
      now - this.data.lastGamePlayed >= this.gamesBeforeAdResetMs
    ) {
      console.log("Resetting games played");
      this.data.gamesPlayed = 0;
    }

    // If played less games than gamesBeforeAd increment games played and don't show ad
    if (
      !this.data.lastGamePlayed ||
      this.data.gamesPlayed < this.gamesBeforeAd
    ) {
      console.log(this.data.gamesPlayed, "Incrementing games played");
      this.data.gamesPlayed = this.data.gamesPlayed + 1;
      this.data.lastGamePlayed = now;
      this.saveData();
      return false;
    }

    // If adFrequencyMs is 0 always show ad
    // If lastAdShown is 0 show ad
    // If time elapsed since last ad shown is greater than adFrequencyMs show ad
    if (!this.adFrequencyMs) {
      console.log("Ad frequency missing always showing ads");
    } else if (!this.data.lastAdShown) {
      console.log("Haven't shown ad yet");
    } else if (now - this.data.lastAdShown >= this.adFrequencyMs) {
      console.log(
        `Time elapsed ${now - this.data.lastAdShown} compared to freqency ${
          this.adFrequencyMs
        }`
      );
    }
    return (
      !this.adFrequencyMs ||
      !this.data.lastAdShown ||
      now - this.data.lastAdShown >= this.adFrequencyMs
    );
  }
}
