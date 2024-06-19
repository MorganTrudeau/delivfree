import * as React from "react";
import { View, StyleSheet, useWindowDimensions, ViewStyle } from "react-native";

import {
  inputTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  toHourInputFormat,
  toHourOutputFormat,
} from "./timeUtils";

import AnalogClock from "./AnalogClock";
import { circleSize } from "./timeUtils";
import TimeInputs from "./TimeInputs";
import { spacing } from "app/theme";

export const DisplayModeContext = React.createContext<{
  mode: "AM" | "PM" | undefined;
  setMode: React.Dispatch<React.SetStateAction<"AM" | "PM" | undefined>>;
}>({ mode: "AM", setMode: () => {} });

type onChangeFunc = ({
  hours,
  minutes,
  focused,
}: {
  hours: number;
  minutes: number;
  focused?: undefined | PossibleClockTypes;
}) => any;

function TimeClockInput({
  hours,
  minutes,
  onFocusInput,
  focused,
  inputType,
  onChange,
  locale,
  roundness = 5,
  onSubmitMinutes,
  inputStyle,
  amPmStyle,
  clockStyle,
}: {
  locale?: undefined | string;
  inputType: PossibleInputTypes;
  focused: PossibleClockTypes;
  hours: number;
  minutes: number;
  onFocusInput: (type: PossibleClockTypes) => any;
  onChange: onChangeFunc;
  roundness?: number;
  onSubmitMinutes?: () => void;
  amPmStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  clockStyle?: ViewStyle;
}) {
  const [displayMode, setDisplayMode] = React.useState<"AM" | "PM" | undefined>(
    undefined
  );
  const dimensions = useWindowDimensions();
  const isLandscape = dimensions.width > dimensions.height;

  // method to check whether we have 24 hours in clock or 12
  const is24Hour = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    const formatted = formatter.format(new Date(Date.UTC(2020, 1, 1, 23)));
    return formatted.includes("23");
  }, [locale]);

  // Initialize display Mode according the hours value
  React.useEffect(() => {
    if (hours >= 12) {
      setDisplayMode("PM");
    } else {
      setDisplayMode("AM");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInnerChange = React.useCallback<onChangeFunc>(
    (params) => {
      params.hours = toHourOutputFormat(params.hours, hours, is24Hour);
      onChange(params);
    },
    [onChange, hours, is24Hour]
  );

  return (
    <DisplayModeContext.Provider
      value={{ mode: displayMode, setMode: setDisplayMode }}
    >
      <View style={isLandscape ? styles.rootLandscape : styles.rootPortrait}>
        <TimeInputs
          roundness={roundness}
          inputType={inputType}
          hours={hours}
          minutes={minutes}
          is24Hour={is24Hour}
          onChange={onChange}
          onFocusInput={onFocusInput}
          focused={focused}
          disabled={inputType === inputTypes.picker}
          onSubmitMinutes={onSubmitMinutes}
          inputStyle={inputStyle}
          amPmStyle={amPmStyle}
        />
        {inputType === inputTypes.picker ? (
          <View style={styles.clockContainer}>
            <AnalogClock
              hours={toHourInputFormat(hours, is24Hour)}
              minutes={minutes}
              focused={focused}
              is24Hour={is24Hour}
              onChange={onInnerChange}
              style={clockStyle}
            />
          </View>
        ) : null}
      </View>
    </DisplayModeContext.Provider>
  );
}

const styles = StyleSheet.create({
  rootLandscape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 24 * 3 + 96 * 2 + 52 + circleSize,
  },
  rootPortrait: { alignItems: "center" },
  clockContainer: {
    paddingTop: spacing.xl,
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
    alignItems: "center",
  },
});

const MemoTimeClockInput = React.memo(TimeClockInput);

export default MemoTimeClockInput;
