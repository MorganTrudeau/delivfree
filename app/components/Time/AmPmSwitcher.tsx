import * as React from "react";
import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useSwitchColors } from "./timeUtils";
import { DisplayModeContext } from "./TimeClockInput";
import moment from "moment";
import { colors } from "app/theme";
import { Text } from "../Text";

const backgroundColor = colors.surface;

export default function AmPmSwitcher({
  onChange,
  hours,
  roundness,
  style,
}: {
  hours: number;
  onChange: (newHours: number) => any;
  roundness: number;
  style?: ViewStyle;
}) {
  const { setMode, mode } = React.useContext(DisplayModeContext);

  const amLabel = React.useMemo(() => {
    return moment().hour(1).format("A");
  }, []);
  const pmLabel = React.useMemo(() => {
    return moment().hour(23).format("A");
  }, []);

  React.useEffect(() => {
    if (hours === 24 && mode !== "AM") {
      setMode("AM");
    } else if (hours > 11 && mode !== "PM") {
      setMode("PM");
    }
  }, [hours, setMode]);

  const isAM = mode === "AM";
  return (
    <View
      style={[
        styles.root,
        {
          borderRadius: roundness,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <SwitchButton
        label={amLabel}
        onPress={() => {
          setMode("AM");
          if (hours - 12 >= 0) {
            onChange(hours - 12);
          }
        }}
        selected={isAM}
        disabled={isAM}
      />
      <View style={[styles.switchSeparator, { backgroundColor }]} />
      <SwitchButton
        label={pmLabel}
        onPress={() => {
          setMode("PM");
          if (hours + 12 <= 24) {
            onChange(hours + 12);
          }
        }}
        selected={!isAM}
        disabled={!isAM}
      />
    </View>
  );
}

function SwitchButton({
  label,
  onPress,
  selected,
  disabled,
}: {
  label: string;
  onPress: (() => any) | undefined;
  selected: boolean;
  disabled: boolean;
}) {
  const { backgroundColor, color } = useSwitchColors(selected);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.switchButton, { backgroundColor }]}
      accessibilityLabel={label}
      // @ts-ignore old React Native versions
      accessibilityTraits={disabled ? ["button", "disabled"] : "button"}
      // @ts-ignore old React Native versions
      accessibilityComponentType="button"
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
    >
      <Text
        selectable={false}
        preset={selected ? "semibold" : "default"}
        style={{
          color: color,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 50,
    height: 80,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  switchSeparator: {
    height: 1,
    width: 48,
  },
  switchButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
