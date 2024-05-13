import { colors } from "app/theme";
import { DateRange, MOMENT_DATE_FORMAT } from "delivfree";
import moment from "moment";
import { CalendarProps } from "react-native-calendars";

export type DateFilter =
  | "today"
  | "last7"
  | "last30"
  | "last90"
  | "lastWeek"
  | "lastMonth"
  | "customRange";

export function dateRangeIteration(
  dateRange: DateRange,
  iteration: (date: string) => void,
  inputFormat?: string,
  outputFormat?: string
) {
  let start = moment(dateRange.start, inputFormat);
  let end = moment(dateRange.end, inputFormat);
  while (start.isBefore(end, "day") || start.isSame(end, "day")) {
    const date = start.format(outputFormat || MOMENT_DATE_FORMAT);
    iteration(date);
    start.add(1, "day");
  }
}

export const makePeriodMarkedDays = (dateRange: DateRange, format: string) => {
  const markedDates: CalendarProps["markedDates"] = {};
  dateRangeIteration(
    dateRange,
    (date) => {
      const m = moment(date, MOMENT_DATE_FORMAT);

      const isStart = m.isSame(moment(dateRange.start, format));
      const isEnd = m.isSame(moment(dateRange.end, format));
      markedDates[date] = {
        startingDay: isStart,
        endingDay: isEnd,
        color: isStart || isEnd ? colors.palette.primary300 : colors.surface,
        // @ts-ignore
        textColor: isStart || isEnd ? colors.white : undefined,
      };
    },
    format
  );
  return markedDates;
};

export function formatDateRangeText(
  dateRange: DateRange,
  includeYear?: boolean
) {
  const { start, end } = dateRange;

  const datesNotInThisYear = (() => {
    const m = moment();

    return !m.isSame(start, "year") || !m.isSame(end, "year");
  })();

  return (
    moment(start).format(`MMM D${datesNotInThisYear ? " YYYY" : ""}`) +
    " - " +
    moment(end).format(
      `MMM D${datesNotInThisYear || includeYear ? " YYYY" : ""}`
    )
  );
}

export const getDateRangeFilterTitle = (dateFilter: DateFilter): string => {
  switch (dateFilter) {
    case "today":
      return "Today";
    case "last7":
      return "Last 7 days";
    case "last30":
      return "Last 30 days";
    case "last90":
      return "Last 90 days";
    case "lastWeek":
      return "Last week";
    case "lastMonth":
      return "Last month";
    case "customRange":
      return "Custom range";
    default:
      return "Last 7 days";
  }
};

export const getDateRangeByFilter = (dateFilter: DateFilter) => {
  const todayRange = {
    start: moment().startOf("day").format(),
    end: moment().endOf("day").format(),
  };
  const last7Range = {
    end: moment().subtract(1, "day").endOf("day").format(),
    start: moment().subtract(7, "day").startOf("day").format(),
  };
  const last30Range = {
    end: moment().subtract(1, "day").endOf("day").format(),
    start: moment().subtract(30, "day").startOf("day").format(),
  };
  const last90Range = {
    end: moment().subtract(1, "day").endOf("day").format(),
    start: moment().subtract(90, "day").startOf("day").format(),
  };
  const lastWeekRange = {
    end: moment().subtract(1, "week").endOf("week").endOf("day").format(),
    start: moment().subtract(1, "week").startOf("week").startOf("day").format(),
  };
  const lastMonthRange = {
    end: moment().subtract(1, "month").endOf("month").endOf("day").format(),
    start: moment()
      .subtract(1, "month")
      .startOf("month")
      .startOf("day")
      .format(),
  };
  switch (dateFilter) {
    case "today":
      return todayRange;
    case "last7":
      return last7Range;
    case "last30":
      return last30Range;
    case "last90":
      return last90Range;
    case "lastWeek":
      return lastWeekRange;
    case "lastMonth":
      return lastMonthRange;
    default:
      return last7Range;
  }
};
