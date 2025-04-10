import Config from "react-native-config";
import { avatarColors } from "../theme";
import { Linking, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { translate } from "app/i18n";
import React from "react";
import { VendorLocation } from "delivfree";
import { AlertProps } from "app/components/Alert/AlertProvider";

export const reorderFromIds = <V extends { id: string }>(
  arr: V[],
  order: string[]
) => {
  const orderMap = {};
  order.forEach((id, index) => {
    orderMap[id] = index;
  });
  return arr.sort((a, b) => orderMap[a.id] - orderMap[b.id]);
};

export const reorder = <V extends { order?: { [id: string]: number } }>(
  arr: V[],
  id: string
) => {
  return arr.sort((a, b) => (a.order?.[id] || 0) - (b.order?.[id] || 0));
};

export const generateKeywords = (str: string) => {
  const keywords: string[] = [];
  for (let i = 1; i < str.length + 1; i++) {
    keywords.push(str.substring(0, i).toLowerCase());
  }
  return keywords;
};

export const generateVendorLocationKeywords = (
  vendorLocation: VendorLocation
) => {
  const terms = [vendorLocation.name, ...vendorLocation.cuisines];
  const keywords: string[] = [];
  terms.forEach((str) => keywords.push(...generateKeywords(str)));
  return keywords;
};

export const pluralFormat = (singleTerm: string, length: number) =>
  `${singleTerm}${length !== 1 ? "s" : ""}`;

export const confirmDelete = (Alert: AlertProps) => {
  return new Promise<boolean>((resolve) => {
    Alert.alert("Confirm delete", "Are you sure you want to delete?", [
      { text: "Cancel", onPress: () => resolve(false) },
      {
        text: "Delete",
        onPress: () => resolve(true),
        style: "destructive",
      },
    ]);
  });
};

export const typedMemo: <T>(c: T) => T = React.memo;

export const equalArrays = (
  arr1: Array<string | number>,
  arr2: Array<string | number>
): boolean => {
  // Check if lengths are the same
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort both arrays
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Compare sorted arrays
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
};

export const getAppType = () => {
  return Config.REACT_NATIVE_APP as "CONSUMER" | "VENDOR" | "ADMIN";
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

export const alertCommonError = (Alert: AlertProps) => {
  return Alert.alert(translate("errors.heading"), translate("errors.common"));
};

export const navigateToAddress = (
  latitude: number,
  longitude: number,
  address: string
) => {
  const scheme = Platform.select({
    ios: "maps://0,0?q=",
    android: "geo:0,0?q=",
  });
  const latLng = `${latitude},${longitude}`;
  const label = "Custom Label";
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
    default: `https://www.google.com/maps/place/${address}/`,
  });
  return Linking.openURL(url);
};

export const isWebNotificationsSupported = () => {
  if (Platform.OS !== "web") {
    return false;
  }
  // @ts-ignore
  return messaging.isSupported();
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

export const errorHasMessage = (
  error: unknown
): error is { message: string } => {
  return !!error && typeof error === "object" && "message" in error;
};

export const errorHasCode = (
  error: unknown
): error is { code: string | number } => {
  return !!error && typeof error === "object" && "code" in error;
};

export const calculateHoursToNextDay = () => {
  // Get the current date and time
  const now = new Date();

  // Set the time to the next day
  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const timeDiff = nextDay.valueOf() - now.valueOf();

  // Convert milliseconds to hours
  const hours = Math.ceil(timeDiff / (1000 * 60 * 60));

  return hours;
};

export const extractQueryParams = (url: string) => {
  const split = url.split("?");
  const path = split[0]?.replace("/", "");
  const queryParamString = split[1];
  if (!queryParamString) {
    return { path, params: {} };
  }

  const queryParams: { [param: string]: string } = {};
  const paramPairs = queryParamString.split("&");
  paramPairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    queryParams[key] = value || "";
  });

  return { path, params: queryParams };
};

export const buildDates = (
  date: Date,
  onlyCurrentMonth?: boolean
): {
  date: Date;
  formattedDate: string;
  placeholder: boolean;
}[] => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const d1 = new Date(start);
  const d2 = new Date(end);

  if (!onlyCurrentMonth) {
    const startDay = d1.getDay();

    if (startDay !== 0) {
      d1.setDate(-(startDay - 1));
    }

    const endDay = d2.getDay();

    if (endDay !== 6) {
      d2.setDate(d2.getDate() + 6 - endDay);
    }
  }

  const dates: {
    date: Date;
    formattedDate: string;
    placeholder: boolean;
  }[] = [];

  while (d1 <= d2) {
    const formattedDate = d1.toISOString().slice(0, 10);
    const placeholder = d1 < start || d1 > end;

    dates.push({
      date: new Date(d1),
      formattedDate,
      placeholder,
    });

    d1.setDate(d1.getDate() + 1);
  }
  return dates;
};

export const formatDateToMonthAbbreviation = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
  }
) => {
  return date.toLocaleString("en-US", options);
};

export const parseFormattedDate = (formattedDate: string) => {
  const [yearString, monthString, dayString] = formattedDate.split("-");

  if (!(yearString && monthString && dayString)) {
    return new Date();
  }

  return new Date(
    Number(yearString),
    Number(monthString) - 1,
    Number(dayString)
  );
};

export const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${padZeros(date.getMonth() + 1)}-${padZeros(
    date.getDate()
  )}`;
};

export const padZeros = (number: number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();

  // Check if the date is today
  if (date.toDateString() === now.toDateString()) {
    return "Today at " + formatTime(date);
  }

  // Check if the date is yesterday
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday at " + formatTime(date);
  }

  // Format the date as a readable English string
  const options = { weekday: "long", month: "long", day: "numeric" } as const;
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate + " at " + formatTime(date);
};

function formatTime(date: Date) {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  let period = "am";

  // Convert to 12-hour format
  if (hours >= 12) {
    period = "pm";
    if (hours > 12) {
      hours -= 12;
    }
  }

  // Add leading zeros to minutes if necessary
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return hours + ":" + minutes + period;
}

export const shadeColor = (hex: string, percent: number) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      // @ts-ignore
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      percent +
      ")"
    );
  }
  return hex;
};

export const shuffle = (array: any[]) => {
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

export const retryRequest = async (
  req: () => Promise<any>,
  n = 3
): Promise<any> => {
  try {
    return await req();
  } catch (err) {
    if (n === 1) {
      throw err;
    }
    console.log("Failed request attempt number", n);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return await retryRequest(req, n - 1);
  }
};

export const generateUid = (n = 9) => {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const randomness = new Array(n).fill(0);

  return randomness.map((_) => S4()).join("");
};

export function generatePin(length = 6) {
  const r = () => Math.floor(Math.random() * Math.floor(10)).toString();
  const randomness = new Array(length).fill(0);
  return randomness.map((n) => r()).join("");
}

export const sumChars = (str: string) => {
  let sum = 0;
  if (typeof str !== "string") {
    return sum;
  }
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
};

export const hexColorFromName = (name: string) => {
  const i = sumChars(name) % avatarColors.length;
  return avatarColors[i];
};

export function isValidEmail(email: string) {
  const reg =
    /^[_a-zA-Z0-9-+]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
  return reg.test(email);
}

export function isValidPostalCode(postalCode: string) {
  if (!postalCode || typeof postalCode !== "string") {
    return false;
  }
  const reg =
    /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
  return reg.test(postalCode);
}

export const localizeCurrency = (
  value: number,
  currency: string = "CAD",
  options = {},
  locale?: string
) => {
  try {
    const localizedCurrency = value.toLocaleString(locale, {
      style: "currency",
      currency: currency,
      // @ts-ignore
      currencyDisplay: "narrowSymbol", // This fails on some OS
      ...options,
    });
    return localizedCurrency;
  } catch (error) {
    return value.toLocaleString(undefined, {
      style: "currency",
      currency: currency,
      ...options,
    });
  }
};
