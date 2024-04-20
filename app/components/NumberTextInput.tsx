import React, { forwardRef, useCallback, useContext } from "react";
import { TextInput, TextInputProps } from "react-native";
import { ToastContext } from "./Toast/ToastContext";

type Props = TextInputProps;

const NumberTextInput = forwardRef<TextInput, Props>(
  ({ onChangeText, value, ...rest }: Props, ref) => {
    const toastContext = useContext(ToastContext);

    const handleChangeText = useCallback(
      (text: string) => {
        if (text !== "" && isNaN(Number(text))) {
          return toastContext.show("Please enter a valid number");
        }

        if (onChangeText) {
          onChangeText(text);
        }
      },
      [onChangeText]
    );

    return (
      <TextInput
        ref={ref}
        keyboardType="number-pad"
        onChangeText={handleChangeText}
        value={value}
        {...rest}
      />
    );
  }
);

export default NumberTextInput;
