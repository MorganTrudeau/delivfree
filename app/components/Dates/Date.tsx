import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { DAY_HEIGHT, ROW_HEIGHT } from "../../utils/constants/dates";
import { colors } from "app/theme";
import { Text } from "../Text";

type Props = {
  date: Date;
  placeholder: boolean;
  onPress: (date: Date) => void;
  active: boolean;
  markedDate?: {
    backgroundColor?: string;
    borderColor?: string;
  };
};

export const Date = React.memo(function Date({
  date,
  placeholder,
  onPress,
  active,
  markedDate,
}: Props) {
  const handlePress = () => {
    onPress(date);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={placeholder ? 0.5 : 1}
      style={[$dayContainer, placeholder && $placeholder]}
    >
      <View style={$dayOuter}>
        <View style={[$dayInner, markedDate, active && $selected]}>
          <Text
            weight={active ? "bold" : "normal"}
            style={active ? $activeText : undefined}
          >
            {date.getDate()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const CONTAINER_HEIGHT = ROW_HEIGHT - 2;

const $activeText = {};

const $placeholder: ViewStyle = {
  opacity: 0.5,
};

const $selected: ViewStyle = {
  borderColor: colors.text,
};

const $dayContainer: ViewStyle = {
  flexBasis: `${100 / 7}%`,
  height: CONTAINER_HEIGHT,
  alignItems: "center",
  justifyContent: "center",
  marginVertical: 1,
};
const $dayOuter: ViewStyle = {
  height: DAY_HEIGHT + 10,
  width: DAY_HEIGHT + 10,
  justifyContent: "center",
  alignItems: "center",
};
const $dayInner: ViewStyle = {
  height: DAY_HEIGHT,
  width: DAY_HEIGHT,
  borderRadius: DAY_HEIGHT,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 3,
  borderColor: colors.transparent,
};
