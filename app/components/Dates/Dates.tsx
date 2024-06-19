import { Dimensions, FlatList, ViewStyle } from "react-native";
import React, { useMemo } from "react";
import { Date as DateItem } from "./Date";
import { MAX_WIDTH } from "app/utils/constants/dates";
import { buildDates, formatDate } from "app/utils/general";

const containerWidth = Math.min(MAX_WIDTH, Dimensions.get("window").width);

type Props = {
  onDatePress: (date: Date) => void;
  currentDate: Date;
  markedDates?: {
    [formattedDate: string]: { backgroundColor?: string; borderColor?: string };
  };
};

export const Dates = ({ onDatePress, currentDate, markedDates }: Props) => {
  const data = useMemo(() => buildDates(currentDate), [currentDate]);

  const formattedCurrentDate = useMemo(
    () => formatDate(currentDate),
    [currentDate]
  );

  const renderDate = ({
    item,
  }: {
    item: {
      date: Date;
      formattedDate: string;
      placeholder: boolean;
    };
  }) => {
    const { date, formattedDate, placeholder } = item;

    const markedDate = markedDates?.[formattedDate];

    return (
      <DateItem
        key={formattedDate}
        date={date}
        placeholder={placeholder}
        onPress={onDatePress}
        active={formattedCurrentDate === formattedDate}
        markedDate={markedDate}
      />
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderDate}
      numColumns={7}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      style={$style}
    />
  );
};

const $style: ViewStyle = {
  width: containerWidth,
  alignSelf: "center",
};
