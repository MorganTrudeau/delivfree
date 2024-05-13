import React, { useMemo, useRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import moment from "moment";
import { $row } from "../styles";
import { colors, spacing } from "app/theme";
import { DateRangeSelectModal } from "./DateRangeSelectModal";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { sizing } from "app/theme/sizing";
import { borderRadius } from "app/theme/borderRadius";
import {
  DateFilter,
  formatDateRangeText,
  getDateRangeByFilter,
  getDateRangeFilterTitle,
} from "app/utils/dates";
import OptionsModal, { OptionModalItem } from "../Modal/OptionsModal";
import { DateRange, ModalRef } from "delivfree";

export const DateRangeSelect = ({
  dateFilter,
  dateRange,
  onFilterByDate,
  style,
}: {
  dateFilter: DateFilter;
  dateRange: DateRange;
  style?: ViewStyle;
  onFilterByDate: (_dateFilter: DateFilter, _dateRange: DateRange) => void;
}) => {
  const dateRangeSelect = useRef<ModalRef>(null);
  const optionsModal = useRef<ModalRef>(null);

  const dateFilterTitle = useMemo(() => {
    return dateRange.start === dateRange.end
      ? moment(dateRange.start).format("MMM DD YYYY")
      : formatDateRangeText(dateRange, true);
  }, [dateRange]);

  const selectCustomRange = () => {
    dateRangeSelect.current?.open();
  };

  const dateFilterOptions: OptionModalItem[] = useMemo(() => {
    const todayRange = getDateRangeByFilter("today");
    const last7Range = getDateRangeByFilter("last7");
    const last30Range = getDateRangeByFilter("last30");
    const last90Range = getDateRangeByFilter("last90");
    const lastWeekRange = getDateRangeByFilter("lastWeek");
    const lastMonthRange = getDateRangeByFilter("lastMonth");
    const options: OptionModalItem[] = [
      {
        value: "today",
        text: getDateRangeFilterTitle("today"),
        description: moment().format("MMM DD"),
        onPress: () => onFilterByDate("today", todayRange),
        selected: dateFilter === "today",
      },
      {
        value: "last7",
        text: getDateRangeFilterTitle("last7"),
        description: formatDateRangeText(last7Range),
        onPress: () => onFilterByDate("last7", last7Range),
        selected: dateFilter === "last7",
      },
      {
        value: "last30",
        text: getDateRangeFilterTitle("last30"),
        description: formatDateRangeText(last30Range),
        onPress: () => onFilterByDate("last30", last30Range),
        selected: dateFilter === "last30",
      },
      {
        value: "last90",
        text: getDateRangeFilterTitle("last90"),
        description: formatDateRangeText(last90Range),
        onPress: () => onFilterByDate("last90", last90Range),
        selected: dateFilter === "last90",
      },
      {
        value: "lastWeek",
        text: getDateRangeFilterTitle("lastWeek"),
        description: formatDateRangeText(lastWeekRange),
        onPress: () => onFilterByDate("lastWeek", lastWeekRange),
        selected: dateFilter === "lastWeek",
      },
      {
        value: "lastMonth",
        text: getDateRangeFilterTitle("lastMonth"),
        description: formatDateRangeText(lastMonthRange),
        onPress: () => onFilterByDate("lastMonth", lastMonthRange),
        selected: dateFilter === "lastMonth",
      },
      {
        value: "customRange",
        text: getDateRangeFilterTitle("customRange"),
        onPress: selectCustomRange,
        selected: dateFilter === "customRange",
      },
    ];
    return options;
  }, [onFilterByDate, dateFilter]);

  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => [
      $row,
      {
        flexWrap: "wrap",
      },
      style,
    ],
    [style]
  );

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={() => optionsModal.current?.open()}
        style={[
          $row,
          {
            borderWidth: 1,
            borderRadius: borderRadius.md,
            borderColor: colors.border,
            alignSelf: "flex-start",
            marginTop: spacing.xs,
          },
        ]}
      >
        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: colors.border,
            flex: 1,
            paddingHorizontal: spacing.xs,
            paddingVertical: spacing.xxs,
          }}
        >
          <Text>{getDateRangeFilterTitle(dateFilter)}</Text>
        </View>
        <View
          style={[
            $row,
            { paddingHorizontal: spacing.xs, paddingVertical: spacing.xxs },
          ]}
        >
          <Icon
            icon={"calendar"}
            style={{ marginRight: spacing.xs }}
            size={sizing.md}
          />
          <Text>{dateFilterTitle}</Text>
        </View>
      </Pressable>

      <OptionsModal
        options={dateFilterOptions}
        ref={optionsModal}
        onSelect={() => optionsModal.current?.close()}
      />

      <DateRangeSelectModal
        ref={dateRangeSelect}
        onConfirm={(_dateRange) => {
          onFilterByDate("customRange", _dateRange);
          dateRangeSelect.current?.close();
        }}
        onCancel={() => dateRangeSelect.current?.close()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: { marginEnd: spacing.lg, marginBottom: spacing.md },
});
