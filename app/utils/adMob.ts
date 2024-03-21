import { Platform } from "react-native";
import mobileAds, {
  AdsConsent,
  //   AdsConsentDebugGeography,
  AdsConsentStatus,
} from "react-native-google-mobile-ads";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";

export const initAdMob = async () => {
  await mobileAds().setRequestConfiguration({});
  await mobileAds().initialize();
};

export const requestAppTrackingTransparency = async () => {
  if (Platform.OS !== "ios") {
    return;
  }
  try {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

    console.log("APP_TRACKING_TRANSPARENCY RESULT", result);

    if (result === RESULTS.UNAVAILABLE || result === RESULTS.DENIED) {
      // The permission has not been requested, so request it.
      await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    }
  } catch (error) {
    console.error("Failed to check app tracking transparency: ", error);
  }
};

export const getEUAdConsent = async () => {
  // AdsConsent.reset();

  const consentInfo = await AdsConsent.requestInfoUpdate({
    // debugGeography: AdsConsentDebugGeography.EEA,
    // testDeviceIdentifiers: ["C0DF799730DC6DDEFBD78D1211D14228"],
  });

  if (
    consentInfo.isConsentFormAvailable &&
    consentInfo.status === AdsConsentStatus.REQUIRED
  ) {
    await AdsConsent.showForm();
  }

  if (
    consentInfo.status === AdsConsentStatus.REQUIRED ||
    consentInfo.status === AdsConsentStatus.OBTAINED
  ) {
    const { storeAndAccessInformationOnDevice } =
      await AdsConsent.getUserChoices();

    return !storeAndAccessInformationOnDevice;
  }

  return undefined;
};
