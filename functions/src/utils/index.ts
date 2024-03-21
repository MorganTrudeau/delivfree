import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { TriviaCategory } from "../types";
import { categories } from "../data";

export const errorHasCode = (error: unknown): error is { code: string } => {
  return !!error && typeof error === "object" && "code" in error;
};

export const errorHasMessage = (
  error: unknown
): error is { message: string } => {
  return !!error && typeof error === "object" && "message" in error;
};

export const removeRandomValue = <T>(arr: Array<T>) => {
  const index = Math.floor(Math.random() * arr.length);

  const val = arr[index];

  arr.splice(index, 1);

  return val;
};

export const requireParams = (params: {
  [key: string]: string | number | boolean;
}) => {
  const missingParams = Object.entries(params).reduce((acc, [key, val]) => {
    if (val === undefined) {
      return [...acc, key];
    }
    return acc;
  }, [] as string[]);

  if (missingParams.length) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Missing params: ${JSON.stringify(missingParams)}`
    );
  }
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const capitalize = (str: string) => {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
};

export const retryPromise = async <T>(
  promise: () => Promise<T>,
  n = 3,
  attempts = 0
): Promise<T> => {
  try {
    return await promise();
  } catch (error) {
    if (attempts <= n) {
      return retryPromise(promise, n, attempts);
    } else {
      throw error;
    }
  }
};

export const getRandomCategory = () => {
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
};

export const getRandomTier = () => {
  const tiers = [1, 2, 3];
  return tiers[Math.floor(Math.random() * tiers.length)];
};

export const getRandomSubcategory = (category: TriviaCategory) => {
  return category;
  // const subcategoryList = subcategoryDict[category];
  // if (!subcategoryList) {
  //   return category;
  // }
  // const randomIndex = Math.floor(Math.random() * subcategoryList.length);
  // return subcategoryList[randomIndex];
};

export const getRatingDelta = (
  myRating: number,
  opponentRating: number,
  myGameResult: 0 | 0.5 | 1
) => {
  if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
    return 0;
  }

  const myChanceToWin =
    1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

  return Math.round(32 * (myGameResult - myChanceToWin));
};

export const getNewRating = (
  myRating: number,
  opponentRating: number,
  myGameResult: 0 | 0.5 | 1
) => {
  return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
};

export const buildMessagePayload = (
  notification: { title: string; body: string },
  data: { [key: string]: string },
  collapseKey: string
  //   link: string
): Omit<admin.messaging.TokenMessage, "token"> => {
  return {
    notification,
    android: {
      notification,
      collapseKey,
      priority: "high" as const,
    },
    apns: {
      payload: {
        aps: { threadId: collapseKey, badge: 1, sound: "default" as const },
      },
    },
    // webpush: {
    //   notification: { ...notification, image: webpushImage },
    //   fcmOptions: {
    //     link,
    //   },
    // },
    data,
  };
};

export const getDeviceTokens = async (userIds: string[]) => {
  const snapshot = await admin
    .firestore()
    .collection("DeviceTokens")
    .where("__name__", "in", userIds)
    .get();

  let deviceTokens: string[] = [];

  if (!snapshot.empty) {
    deviceTokens = snapshot.docs.reduce((acc, doc) => {
      const data = doc.data() as { [id: string]: string } | null;

      if (data && typeof data === "object") {
        return [...acc, ...Object.values(data)];
      }

      return acc;
    }, [] as string[]);
  }

  return deviceTokens;
};

export const shuffle = (array: string[]) => {
  let currentIndex = array.length;
  let randomIndex = array.length;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const arrayDiff = <T>(
  arrA: Array<T>,
  arrB: Array<T>,
  valueExtractor?: (val: T) => string | number
): T[] => {
  let set = new Set<T>();

  if (Array.isArray(arrA)) {
    if (!Array.isArray(arrB)) {
      set = new Set(arrA);
    } else {
      if (typeof valueExtractor === "function") {
        arrA.forEach((valA) => {
          if (
            arrB.findIndex(
              (valB) => valueExtractor(valB) === valueExtractor(valA)
            ) === -1
          ) {
            set.add(valA);
          }
        });
      } else {
        arrA.forEach((val) => {
          if (!arrB.includes(val)) {
            set.add(val);
          }
        });
      }
    }
  }
  return Array.from(set);
};

export const parseFormattedDate = (formattedDate: string) => {
  const [yearString, monthString, dayString] = formattedDate.split("-");

  console.log(Number(yearString), Number(monthString), Number(dayString));

  if (!(yearString && monthString && dayString)) {
    return new Date();
  }

  return new Date(
    Number(yearString),
    Number(monthString) - 1,
    Number(dayString)
  );
};
