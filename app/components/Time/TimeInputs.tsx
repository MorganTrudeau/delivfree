import * as React from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TextInput as TextInputNative,
  ViewStyle,
} from "react-native";

import {
  clockTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  toHourInputFormat,
  toHourOutputFormat,
} from "./timeUtils";
import TimeInput from "./TimeInput";
import AmPmSwitcher from "./AmPmSwitcher";
import { useLatest } from "./utils";
import { colors } from "app/theme";
import { isRTL } from "app/i18n";

function TimeInputs({
  hours,
  minutes,
  onFocusInput,
  focused,
  inputType,
  onChange,
  is24Hour,
  roundness,
  disabled,
  onSubmitMinutes,
  inputStyle,
  amPmStyle,
}: {
  inputType: PossibleInputTypes;
  focused: PossibleClockTypes;
  hours: number;
  minutes: number;
  onFocusInput: (type: PossibleClockTypes) => any;
  onChange: (hoursMinutesAndFocused: {
    hours: number;
    minutes: number;
    focused?: undefined | PossibleClockTypes;
  }) => any;
  is24Hour: boolean;
  roundness: number;
  disabled?: boolean;
  onSubmitMinutes?: () => void;
  amPmStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}) {
  const startInput = React.useRef<TextInputNative | null>(null);
  const endInput = React.useRef<TextInputNative | null>(null);
  const dimensions = useWindowDimensions();
  const isLandscape = dimensions.width > dimensions.height;

  const onSubmitStartInput = React.useCallback(() => {
    if (endInput.current) {
      endInput.current.focus();
    }
  }, [endInput]);

  const onSubmitEndInput = React.useCallback(() => {
    // TODO: close modal and persist time
    onSubmitMinutes && onSubmitMinutes();
  }, [onSubmitMinutes]);

  const minutesRef = useLatest(minutes);
  const onChangeAmPm = React.useCallback(
    (newHours: number) => {
      onChange({
        hours: newHours,
        minutes: minutesRef.current,
      });
    },
    [onChange, minutesRef]
  );

  React.useEffect(() => {
    if (disabled) {
      startInput.current && startInput.current.blur();
      endInput.current && endInput.current.blur();
    }
  }, [disabled]);

  return (
    <View
      style={[
        styles.inputContainer,
        isLandscape && styles.inputContainerLandscape,
      ]}
    >
      <TimeInput
        roundness={roundness}
        ref={startInput}
        placeholder={"00"}
        value={toHourInputFormat(hours, is24Hour)}
        clockType={clockTypes.hours}
        pressed={focused === clockTypes.hours}
        onPress={onFocusInput}
        inputType={inputType}
        returnKeyType={"next"}
        onSubmitEditing={onSubmitStartInput}
        blurOnSubmit={false}
        onChanged={(newHoursFromInput) => {
          let newHours = toHourOutputFormat(newHoursFromInput, hours, is24Hour);
          if (newHoursFromInput > 24) {
            newHours = 24;
          }
          onChange({
            hours: newHours,
            minutes,
          });
        }}
        style={inputStyle}
        // onChangeText={onChangeStartInput}
      />
      <View style={styles.hoursAndMinutesSeparator}>
        <View style={styles.spaceDot} />
        <View style={[styles.dot, { backgroundColor: colors.text }]} />
        <View style={styles.betweenDot} />
        <View style={[styles.dot, { backgroundColor: colors.text }]} />
        <View style={styles.spaceDot} />
      </View>
      <TimeInput
        roundness={roundness}
        ref={endInput}
        placeholder={"00"}
        value={minutes}
        clockType={clockTypes.minutes}
        pressed={focused === clockTypes.minutes}
        onPress={onFocusInput}
        inputType={inputType}
        onSubmitEditing={onSubmitEndInput}
        onChanged={(newMinutesFromInput) => {
          let newMinutes = newMinutesFromInput;
          if (newMinutesFromInput > 59) {
            newMinutes = 59;
          }
          onChange({
            hours,
            minutes: newMinutes,
          });
        }}
        style={inputStyle}
      />
      {!is24Hour && (
        <>
          <View style={styles.spaceBetweenInputsAndSwitcher} />
          <AmPmSwitcher
            roundness={roundness}
            hours={hours}
            onChange={onChangeAmPm}
            style={amPmStyle}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  spaceBetweenInputsAndSwitcher: { width: 12 },
  inputContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainerLandscape: {
    flex: 1,
  },
  hoursAndMinutesSeparator: {
    fontSize: 65,
    width: 24,
    alignItems: "center",
  },
  spaceDot: {
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 7 / 2,
  },
  betweenDot: {
    height: 12,
  },
});

export default React.memo(TimeInputs);
