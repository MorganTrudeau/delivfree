import moment from "moment";
import React, { forwardRef, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ConfirmCancelButtons from "../ConfirmCancelButtons";
import AppCalendar from "./AppCalendar";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { DateRange, ModalRef } from "delivfree";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { makePeriodMarkedDays } from "app/utils/dates";
import { borderRadius } from "app/theme/borderRadius";

const DATE_FORMAT = "DD/MM/YYYY";
const MOMENT_DATE_FORMAT = "YYYY-MM-DD";

type Props = {
  onConfirm: (dateRange: DateRange) => void;
  onCancel: () => void;
};

export const DateRangeSelect = ({ onConfirm, onCancel }: Props) => {
  const [activeDateInput, setActiveDateInput] = useState<"start" | "end">(
    "start"
  );
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const handleConfirm = () => {
    onConfirm({
      start: moment(dateRange.start, DATE_FORMAT).format(MOMENT_DATE_FORMAT),
      end: moment(dateRange.end, DATE_FORMAT).format(MOMENT_DATE_FORMAT),
    });
  };

  const setDate = (date: Date) => {
    const m = moment(date, DATE_FORMAT);
    const formatted = m.format(DATE_FORMAT);
    if (activeDateInput === "start") {
      setDateRange((s) => ({
        ...s,
        start: formatted,
        end:
          !s.end || m.isAfter(moment(s.end, DATE_FORMAT)) ? formatted : s.end,
      }));
      setActiveDateInput("end");
    } else if (activeDateInput === "end") {
      setDateRange((s) => ({
        ...s,
        start:
          !s.start || m.isBefore(moment(s.start, DATE_FORMAT))
            ? formatted
            : s.start,
        end: formatted,
      }));
    }
  };

  const markedDates = useMemo(
    () => makePeriodMarkedDays(dateRange, DATE_FORMAT),
    [dateRange]
  );

  console.log(markedDates);

  return (
    <View style={styles.container}>
      <View style={styles.dateInputRow}>
        <DateInput
          title={"Start"}
          active={activeDateInput === "start"}
          date={dateRange.start}
          onPress={() => setActiveDateInput("start")}
        />
        <DateInput
          title={"End"}
          active={activeDateInput === "end"}
          date={dateRange.end}
          onPress={() => setActiveDateInput("end")}
        />
      </View>
      <AppCalendar
        onCancel={onCancel}
        setDate={setDate}
        showHeader={false}
        dayPressUpdates
        markedDates={markedDates}
        markingType={"period"}
      />
      <ConfirmCancelButtons
        onConfirm={handleConfirm}
        onCancel={onCancel}
        style={styles.confirmCancelButtons}
        confirmDisabled={!(dateRange.start && dateRange.end)}
      />
    </View>
  );
};

const DateInput = ({
  active,
  title,
  onPress,
  date,
}: {
  active: boolean;
  title: string;
  onPress: () => void;
  date: string;
}) => {
  return (
    <View style={styles.dateInputContainer}>
      <Text style={styles.dateLabel}>{title}</Text>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.dateInput, active && styles.activeDateInput]}
      >
        <Text style={!date ? { color: colors.textDim } : undefined}>
          {date || DATE_FORMAT}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const DateRangeSelectModal = forwardRef<ModalRef, Props>(
  (props, ref) => {
    return (
      <ReanimatedCenterModal
        ref={ref}
        tapToClose
        contentStyle={{ maxWidth: 400 }}
      >
        <DateRangeSelect {...props} />
      </ReanimatedCenterModal>
    );
  }
);

const styles = StyleSheet.create({
  activeDateInput: { borderColor: colors.primary },
  confirmCancelButtons: {
    marginTop: 0,
    paddingHorizontal: 0,
  },
  container: {
    padding: spacing.lg,
  },
  dateInput: {
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    flex: 1,
    padding: spacing.sm,
  },
  dateInputContainer: { flex: 1, padding: spacing.xs },
  dateInputRow: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    paddingBottom: spacing.md,
  },
  dateLabel: { marginBottom: spacing.sm },
});
