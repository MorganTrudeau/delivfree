import { colors } from "app/theme";
import React, { Ref, forwardRef } from "react";
import { TextInputProps, TextInput as RNTextInput } from "react-native";
import { $input } from "./styles";

export const TextInputWithoutRef = (
  props: TextInputProps,
  ref: Ref<RNTextInput>
) => {
  return (
    <RNTextInput
      placeholderTextColor={colors.textDim}
      {...props}
      ref={ref}
      style={[$input, props.style]}
      scrollEnabled={false}
    />
  );
};

export const TextInput = forwardRef(TextInputWithoutRef);
