import React, { useCallback } from "react";

import { Dates } from "./Dates";
import { WeekDays } from "./Weekdays";

export type Props = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  markedDates?: {
    [formattedDate: string]: { backgroundColor?: string; borderColor?: string };
  };
};

export const Calendar = ({ currentDate, onDateChange, markedDates }: Props) => {
  const handleDatePress = useCallback(
    (date: Date) => {
      onDateChange(date);
    },
    [onDateChange]
  );

  return (
    <>
      <WeekDays />
      <Dates
        onDatePress={handleDatePress}
        key={currentDate.getMonth()}
        currentDate={currentDate}
        markedDates={markedDates}
      />
    </>
  );
};
