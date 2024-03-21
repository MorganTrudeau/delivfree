import React, { useCallback, forwardRef } from "react";

import { TextInput } from "./TextInput";
import { TextInput as RNTextInput, TextInputProps } from "react-native";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";

export const BottomSheetTextInput = forwardRef<RNTextInput, TextInputProps>(
  function BottomSheetTextInput({ onFocus, onBlur, ...rest }, ref) {
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

    const handleOnFocus = useCallback(
      (args) => {
        shouldHandleKeyboardEvents.value = true;
        if (onFocus) {
          onFocus(args);
        }
      },
      [onFocus, shouldHandleKeyboardEvents]
    );
    const handleOnBlur = useCallback(
      (args) => {
        shouldHandleKeyboardEvents.value = false;
        if (onBlur) {
          onBlur(args);
        }
      },
      [onBlur, shouldHandleKeyboardEvents]
    );

    return (
      <TextInput
        ref={ref}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...rest}
      />
    );
  }
);

export default BottomSheetTextInput;
