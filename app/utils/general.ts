import { avatarColors } from "../theme";

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

export const errorHasCode = (error: unknown): error is { code: string } => {
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
