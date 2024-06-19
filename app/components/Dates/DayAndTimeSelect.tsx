import React, { useRef } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { ButtonSmall } from "../ButtonSmall";
import { $row } from "../styles";
import { spacing } from "app/theme";
import AppTimeInput from "../Time/AppTimeInput";
import moment from "moment";
import { Toggle } from "../Toggle";
import { DaysAndTimes } from "delivfree";
import { daysOfWeek } from "app/utils/dates";

export const DayAndTimeSelect = ({
  style,
  onChange,
  daysAndTimes,
}: {
  style?: ViewStyle;
  onChange: (daysAndTimes: DaysAndTimes) => void;
  daysAndTimes: DaysAndTimes;
}) => {
  const { days, startTime, endTime, allDay } = daysAndTimes;

  const daysAndTimesRef = useRef(daysAndTimes);
  daysAndTimesRef.current = daysAndTimes;

  return (
    <View style={style}>
      <ScrollView horizontal>
        <ButtonSmall
          text={"Every day"}
          onPress={() => {
            onChange({
              ...daysAndTimes,
              days: days.length === 7 ? [] : daysOfWeek.map((_, i) => i),
            });
          }}
          preset={days.length === 7 ? "reversed" : "default"}
          style={{ marginRight: spacing.xs }}
        />
        {daysOfWeek.map((day, index) => {
          const selected = days.includes(index);
          return (
            <ButtonSmall
              key={day}
              text={day}
              onPress={() => {
                onChange({
                  ...daysAndTimes,
                  days: selected
                    ? days.filter((d) => d !== index)
                    : [...days, index],
                });
              }}
              preset={selected ? "reversed" : "default"}
              style={{ marginRight: spacing.xs }}
            />
          );
        })}
      </ScrollView>

      <View
        style={[$row, { marginTop: spacing.sm, opacity: allDay ? 0.5 : 1 }]}
        pointerEvents={allDay ? "none" : "auto"}
      >
        <AppTimeInput
          time={startTime}
          initialTime={{ hours: 8, minutes: 0 }}
          onChangeTime={(date) => {
            const m = moment(date);
            onChange({
              ...daysAndTimesRef.current,
              startTime: { hours: m.hours(), minutes: m.minutes() },
            });
          }}
          title={"Start time"}
          inputStyle={{ marginRight: spacing.xs }}
        />
        <AppTimeInput
          time={endTime}
          initialTime={{ hours: 17, minutes: 0 }}
          onChangeTime={(date) => {
            const m = moment(date);
            onChange({
              ...daysAndTimesRef.current,
              endTime: { hours: m.hours(), minutes: m.minutes() },
            });
          }}
          title={"End time"}
        />
      </View>

      <Toggle
        label={"All day"}
        value={allDay}
        onValueChange={(allDay) => onChange({ ...daysAndTimes, allDay })}
        containerStyle={{ marginTop: spacing.sm }}
      />
    </View>
  );
};
