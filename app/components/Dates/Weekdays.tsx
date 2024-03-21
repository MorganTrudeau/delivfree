import React from "react";
import { StyleSheet, View } from "react-native";
import { DAY_WIDTH, WEEK_DAY_HEIGHT } from "../../utils/constants/dates";
import { Text } from "../Text";

const WeekDay = ({ day }: { day: string }) => {
  return (
    <View style={styles.weekDay}>
      <Text>{day}</Text>
    </View>
  );
};

export const WeekDays = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <View style={styles.weekDayContainer}>
      {days.map((day) => (
        <WeekDay day={day} key={day} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  weekDay: {
    alignItems: "center",
    width: DAY_WIDTH,
  },
  weekDayContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: WEEK_DAY_HEIGHT,
    justifyContent: "center",
    width: "100%",
  },
});
