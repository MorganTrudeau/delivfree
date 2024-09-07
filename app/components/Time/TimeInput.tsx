import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import NumberTextInput from "../NumberTextInput";
import {
  inputTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  useInputColors,
} from "./timeUtils";

interface TimeInputProps
  extends Omit<Omit<TextInputProps, "value" | "onPress">, "onFocus"> {
  value: number;
  clockType: PossibleClockTypes;
  onPress?: (type: PossibleClockTypes) => any;
  pressed: boolean;
  onChanged: (n: number) => any;
  inputType: PossibleInputTypes;
  roundness: number;
  style?: ViewStyle;
}

function TimeInput(
  {
    value,
    clockType,
    pressed,
    onPress,
    onChanged,
    inputType,
    roundness,
    style,
    ...rest
  }: TimeInputProps,
  ref: ForwardedRef<TextInput>
) {
  const [controlledValue, setControlledValue] = useState<string>(`${value}`);

  const onInnerChange = (text: string) => {
    setControlledValue(text);
    if (text !== "") {
      onChanged(Number(text));
    }
  };

  useEffect(() => {
    setControlledValue(`${value}`);
  }, [value]);

  const [inputFocused, setInputFocused] = useState<boolean>(false);

  const highlighted = inputType === inputTypes.picker ? pressed : inputFocused;

  const { color, backgroundColor, placeholderTextColor } =
    useInputColors(highlighted);

  let formattedValue = controlledValue;
  if (!inputFocused) {
    formattedValue =
      controlledValue.length === 1
        ? `0${controlledValue}`
        : `${controlledValue}`;
  }

  return (
    <View style={styles.root}>
      <NumberTextInput
        ref={ref}
        style={[
          styles.input,
          {
            color,
            backgroundColor,
            borderRadius: roundness,
          },
          style,
        ]}
        value={formattedValue}
        maxLength={2}
        onFocus={() => {
          setInputFocused(true);
          onInnerChange("");
        }}
        onBlur={() => setInputFocused(false)}
        keyboardType="number-pad"
        onChangeText={onInnerChange}
        placeholderTextColor={placeholderTextColor}
        {...rest}
      />
      {onPress && inputType === inputTypes.picker ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            styles.buttonOverlay,
            {
              borderRadius: roundness,
            },
          ]}
          onPress={() => onPress(clockType)}
        >
          <View />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: "relative", height: 80, width: 96 },
  input: {
    fontSize: 50,
    textAlign: "center",
    textAlignVertical: "center",
    width: 96,
    height: 80,
  },
  buttonOverlay: { overflow: "hidden" },
});

const ForwardRefTimeInput = forwardRef(TimeInput);

export default ForwardRefTimeInput;
