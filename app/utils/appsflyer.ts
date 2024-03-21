import Appsflyer from "react-native-appsflyer";

export const initAppsflyer = () => {
  Appsflyer.initSdk(
    {
      devKey: "7sfN72Dx89ys2AfDdRyrCm",
      isDebug: false,
      appId: "6449789072",
      timeToWaitForATTUserAuthorization: 15,
    },
    (result) => {
      console.log(result);
    },
    (error) => {
      console.error(error);
    }
  );
};

export const logAppsflyerEvent = async (
  eventName: string,
  eventParams: object
) => {
  try {
    await Appsflyer.logEvent(eventName, eventParams);
  } catch (error) {
    console.log("Failed to log appsflyer event", error);
  }
};
