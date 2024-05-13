import React, { forwardRef } from "react";
import PhoneInput, { PhoneInputProps } from "react-native-phone-number-input";
import { $input } from "./styles";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";
import { TextInput, TextStyle, View, ViewStyle } from "react-native";
import { CountryCode } from "delivfree";

interface Props extends PhoneInputProps {
  label: string;
  containerStyle?: ViewStyle;
  onChangeCallingCode?: (
    callingCode: string,
    callingCountry: CountryCode
  ) => void;
  callingCountry: CountryCode;
}

export const PhoneNumberInput = forwardRef<PhoneInput, Props>(
  function PhoneNumberInput(
    {
      label,
      containerStyle,
      onChangeCallingCode,
      onChangeCountry,
      callingCountry,
      ...rest
    },
    ref
  ) {
    return (
      <View style={containerStyle}>
        {!!label && (
          <Text preset="formLabel" text={label} style={$labelStyle} />
        )}
        <PhoneInput
          // @ts-ignore
          ref={ref}
          textInputStyle={$input}
          textInputProps={{
            placeholderTextColor: colors.textDim,
            ...rest.textInputProps,
          }}
          containerStyle={{
            width: undefined,
            backgroundColor: colors.background,
            padding: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
          textContainerStyle={{
            backgroundColor: colors.background,
            padding: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
          flagButtonStyle={{
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
            ...$input,
            flexDirection: "row",
            minHeight: 0,
            paddingVertical: 0,
            padding: 0,
            marginRight: spacing.sm,
          }}
          // @ts-ignore
          flagSize={25}
          codeTextStyle={{
            marginRight: 0,
            marginLeft: spacing.xxs,
            color: colors.text,
          }}
          disableArrowIcon
          defaultCode={callingCountry || "CA"}
          onChangeCountry={(country) => {
            if (onChangeCountry) {
              onChangeCountry(country);
            }
            if (onChangeCallingCode) {
              onChangeCallingCode(`+${country.callingCode[0]}`, country.cca2);
            }
          }}
          {...rest}
        />
      </View>
    );
  }
);

const $labelStyle: TextStyle = {
  marginBottom: spacing.xxs,
};
