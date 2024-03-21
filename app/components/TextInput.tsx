import { colors, spacing, typography } from "app/theme";
import React, { Ref, forwardRef, useState } from "react";
import {
  TextInputProps,
  ViewStyle,
  TextInput as RNTextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextStyle,
} from "react-native";

export const TextInputWithoutRef = (
  props: TextInputProps,
  ref: Ref<RNTextInput>
) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (props.onFocus) {
      props.onFocus(e);
    }
    setFocused(true);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (props.onBlur) {
      props.onBlur(e);
    }
    setFocused(false);
  };

  return (
    <RNTextInput
      placeholderTextColor={colors.textDim}
      {...props}
      ref={ref}
      style={[$input, focused ? $focusStyle : $blurStyle, props.style]}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export const TextInput = forwardRef(TextInputWithoutRef);

const $input: TextStyle = {
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.xxs,
  borderBottomWidth: 2,
  color: colors.text,
  fontSize: 16,
  lineHeight: 22,
  fontFamily: typography.primary.normal,
};

const $focusStyle: ViewStyle = { borderColor: colors.palette.primary600 };

const $blurStyle: ViewStyle = { borderColor: colors.palette.primary100 };
