import analytics from "@react-native-firebase/analytics";

export const logAnalytics = async (event: string) => {
  try {
    await analytics().logEvent(event);
  } catch (error) {
    console.log(error);
  }
};
