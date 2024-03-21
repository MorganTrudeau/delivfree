import React, { useMemo } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { $row } from "../styles";
import { Text } from "../Text";
import { isRTL } from "app/i18n";
import { Icon } from "../Icon";
import { colors, spacing } from "app/theme";
import { formatDateToMonthAbbreviation } from "app/utils/general";

type Props = {
  currentDate: Date;
  onChange: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
  toggleCalendarOpen?: () => void;
  calendarOpen?: boolean;
};

export const MonthPicker = ({
  currentDate,
  onChange,
  style,
  toggleCalendarOpen,
}: Props) => {
  const formattedMonth = useMemo(
    () => formatDateToMonthAbbreviation(currentDate),
    [currentDate]
  );

  const nextMonth = () => {
    onChange(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    onChange(new Date(currentDate.getFullYear(), currentDate.getMonth(), 0));
  };

  return (
    <View style={[$row, style]}>
      <Pressable
        disabled={!toggleCalendarOpen}
        hitSlop={15}
        onPress={toggleCalendarOpen}
        style={$row}
      >
        <Text preset="heading">{formattedMonth}</Text>
      </Pressable>

      <View style={$buttonContainer}>
        <AppArrowButton onPress={prevMonth} direction="left" />
        <AppArrowButton onPress={nextMonth} style={$nextButton} />
      </View>
    </View>
  );
};

type ArrowButtonProps = {
  onPress: () => void;
  direction?: "right" | "left";
  style?: ViewStyle;
};

const AppArrowButton = ({
  onPress,
  direction = "right",
  style,
}: ArrowButtonProps) => {
  return (
    <Pressable onPress={onPress} hitSlop={15} style={[$arrowButton, style]}>
      <Icon
        icon={direction === "right" ? "arrow-right" : "arrow-left"}
        color={"#fff"}
        size={20}
      />
    </Pressable>
  );
};

const $arrowButton: ViewStyle = {
  backgroundColor: colors.palette.neutral800,
  borderRadius: 5,
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.xs,
};

const $buttonContainer: StyleProp<ViewStyle> = [
  $row,
  {
    marginStart: 15,
    flex: 1,
    justifyContent: isRTL ? "flex-start" : "flex-end",
  },
  isRTL && {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginStart: 0,
    marginEnd: 15,
  },
];
const $nextButton: ViewStyle = isRTL ? { marginEnd: 12 } : { marginStart: 12 };
