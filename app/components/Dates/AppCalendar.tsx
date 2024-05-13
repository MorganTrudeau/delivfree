import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import moment, { MomentInput } from "moment";
import { Calendar, CalendarProps } from "react-native-calendars";
import { Icon } from "../Icon";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { isRTL } from "app/i18n";

type CalendarObject = {
  day: number; // day of month (1-31)
  month: number; // month of year (1-12)
  year: number; // year
  timestamp: number; // UTC timestamp representing 00:00 AM of this date
  dateString: string; // date formatted as 'YYYY-MM-DD' string
};
export type Props = {
  onCancel: () => void;
  showHeader?: boolean;
  date?: MomentInput;
  dayPressUpdates?: boolean;
  setDate: (date: Date) => void;
  dateSelectConfirmation?: (date: Date) => boolean;
} & CalendarProps;

export const AppCalendar = ({
  setDate,
  showHeader = true,
  date,
  dateSelectConfirmation,
  dayPressUpdates,
  ...rest
}: Props) => {
  const hasMounted = useRef(false);

  const [selectedDate, setSelectedDate] = useState(moment(date));
  const formattedDate = useMemo(
    () => selectedDate.format("YYYY-MM-DD"),
    [selectedDate]
  );
  const localeMoment = useMemo(() => moment(formattedDate), [formattedDate]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
    } else if (dayPressUpdates) {
      handleSetDate();
    }
  }, [selectedDate]);

  const handleSetDate = () => {
    setDate(selectedDate.toDate());
  };

  const shouldSetDate = () => {
    if (typeof dateSelectConfirmation === "function") {
      return dateSelectConfirmation(selectedDate.toDate());
    }
    return true;
  };

  const submitDate = () => {
    if (!shouldSetDate()) {
      return;
    }
    handleSetDate();
  };

  const renderArrow = useCallback((dir: "left" | "right") => {
    return (
      <Icon
        icon={dir === "left" ? "arrow-left" : "arrow-right"}
        color={colors.primary}
        size={sizing.md}
      />
    );
  }, []);

  const renderHeader = ({
    month,
    addMonth,
  }: {
    month: Date;
    addMonth: (count: number) => void;
  }) => {
    const onLeft = () => addMonth(isRTL ? 1 : -1);
    const onRight = () => addMonth(isRTL ? -1 : 1);

    return (
      <View
        style={[
          global.row,
          {
            flexDirection: isRTL ? "row-reverse" : "row",
            justifyContent: "space-between",
          },
        ]}
      >
        <MonthArrow dir={"left"} onPress={onLeft} />
        <Text style={[global.title, { color: colors.primary, margin: 10 }]}>
          {findMonthValue(month)}
        </Text>
        <MonthArrow dir={"right"} onPress={onRight} />
      </View>
    );
  };

  return (
    <>
      {showHeader && (
        <View
          style={[
            global.row,
            {
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <View>
            <Text style={[global.textSmallWhite, { textAlign: "left" }]}>
              {localeMoment.format("YYYY")}
            </Text>
            <Text style={[global.titleExtraLargeWhite, { textAlign: "left" }]}>
              {localeMoment.format("ddd, MMMM D")}
            </Text>
          </View>
        </View>
      )}
      {/** @ts-ignore */}
      <Calendar
        renderArrow={renderArrow}
        current={formattedDate}
        minDate={"2019-01-01"}
        maxDate={"2030-01-01"}
        onDayPress={({ dateString }: CalendarObject) =>
          setSelectedDate(moment(dateString))
        }
        weekStyle={styles.weekStyle}
        customHeader={renderHeader}
        style={{
          minHeight: 330,
          width: "100%",
          maxWidth: 400,
          padding: 5,
        }}
        findDayValue={findDayValue}
        findMonthValue={findMonthValue}
        getWeekDayNames={getWeekDayNames}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: colors.textDim,
          textSectionTitleDisabledColor: colors.textDim,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.background,
          todayTextColor: colors.text,
          dayTextColor: colors.text,
          textDisabledColor: colors.textDim,
          dotColor: colors.primary,
          arrowColor: colors.primary,
          disabledArrowColor: colors.textDim,
          monthTextColor: colors.primary,
          indicatorColor: colors.primary,
          textDayFontWeight: "500",
          textMonthFontWeight: "500",
          // @ts-ignore
          selectedDayFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
        {...rest}
      />
    </>
  );
};

const MonthArrow = ({
  dir,
  onPress,
}: {
  dir: "left" | "right";
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={global.hitSlop}
      style={{ padding: 10 }}
    >
      <Icon
        icon={dir === "left" ? "arrow-left" : "arrow-right"}
        color={colors.primary}
        size={sizing.md}
      />
    </TouchableOpacity>
  );
};

const findDayValue = (date: Date) => {
  return date.getDate().toLocaleString();
};

const findMonthValue = (date: Date) => {
  return moment(date.toString()).utc().format("MMMM YYYY");
};

const getWeekDayNames = (firstDay: number) => {
  let days = [0, 1, 2, 3, 4, 5, 6];
  const dayShift = firstDay % 7;
  if (firstDay > 0) {
    days = days.slice(dayShift).concat(days.slice(0, dayShift));
  }
  return days.map((d) => moment().day(d).format("ddd"));
};

const styles = StyleSheet.create({
  optionsText: {
    ...global.text,
    color: colors.primary,
  },
  header: StyleSheet.flatten([
    global.row,
    {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  ]),
  footer: {
    ...global.row,
    justifyContent: "flex-end",
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  footerButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  weekStyle: { flexDirection: isRTL ? "row-reverse" : "row" },
});

export default AppCalendar;
