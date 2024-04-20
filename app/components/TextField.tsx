import React, {
  ComponentType,
  forwardRef,
  Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { isRTL, translate } from "../i18n";
import { colors, spacing, typography } from "../theme";
import { $fontSizeStyles, Text, TextProps } from "./Text";
import { borderRadius } from "app/theme/borderRadius";
import NumberTextInput from "./NumberTextInput";

export interface TextFieldAccessoryProps {
  style: StyleProp<any>;
  status: TextFieldProps["status"];
  multiline: boolean;
  editable: boolean;
}

export interface TextFieldProps extends Omit<TextInputProps, "ref"> {
  numberInput?: boolean;
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled";
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"];
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"];
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"];
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps;
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"];
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"];
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"];
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps;
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps["text"];
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps["tx"];
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps["txOptions"];
  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>;
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>;
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<TextFieldAccessoryProps>;
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<TextFieldAccessoryProps>;
  /**
   * Function to validate input
   */
  validation?: (val: string) => boolean;
}

/**
 * A component that allows for the entering and editing of text.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-TextField.md)
 */
export const TextField = forwardRef(function TextField(
  props: TextFieldProps,
  ref: Ref<TextInput>
) {
  const {
    labelTx,
    label,
    labelTxOptions,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    status,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    style: $inputStyleOverride,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    numberInput,
    validation,
    ...TextInputProps
  } = props;
  const input = useRef<TextInput>(null);
  const value = useRef(
    TextInputProps.value || TextInputProps.defaultValue || ""
  );

  const [focused, setFocused] = useState();
  const [error, setError] = useState(false);

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (props.onFocus) {
        props.onFocus(e);
      }
    },
    [props.onFocus]
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (props.onBlur) {
        props.onBlur(e);
      }
      if (validation) {
        const isValid = validation(value.current);
        setError(!isValid);
      }
    },
    [props.onBlur, validation]
  );

  const handleChangeText = useCallback(
    (val: string) => {
      if (props.onChangeText) {
        props.onChangeText(val);
      }
      value.current = val;
    },
    [props.onChangeText]
  );

  const Input = useMemo(
    () => (numberInput ? NumberTextInput : TextInput),
    [numberInput]
  );

  const disabled = TextInputProps.editable === false || status === "disabled";

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder;

  const $containerStyles = [$containerStyleOverride];

  const $labelStyles = [$labelStyle, LabelTextProps?.style];

  const $inputWrapperStyles = [
    $inputWrapperStyle,
    error && { borderColor: colors.error },
    TextInputProps.multiline && { minHeight: 112 },
    LeftAccessory && { paddingStart: 0 },
    RightAccessory && { paddingEnd: 0 },
    $inputWrapperStyleOverride,
  ];

  const $inputStyles: StyleProp<TextStyle> = [
    $inputStyle,
    disabled && { color: colors.textDim },
    isRTL && { textAlign: "right" },
    TextInputProps.multiline && { height: "auto" },
    $inputStyleOverride,
  ];

  const $helperStyles = [
    $helperStyle,
    error && { color: colors.error },
    HelperTextProps?.style,
  ];

  function focusInput() {
    if (disabled) return;

    input.current?.focus();
  }

  // @ts-ignore
  useImperativeHandle(ref, () => input.current);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={$containerStyles}
      onPress={focusInput}
      accessibilityState={{ disabled }}
    >
      {!!(label || labelTx) && (
        <Text
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          {...LabelTextProps}
          style={$labelStyles}
        />
      )}

      <View style={$inputWrapperStyles}>
        {!!LeftAccessory && (
          <LeftAccessory
            style={$leftAccessoryStyle}
            status={status}
            editable={!disabled}
            multiline={!!TextInputProps.multiline}
          />
        )}

        <Input
          ref={input}
          underlineColorAndroid={colors.transparent}
          textAlignVertical="top"
          placeholder={placeholderContent}
          placeholderTextColor={colors.textDim}
          {...TextInputProps}
          editable={!disabled}
          style={$inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={$rightAccessoryStyle}
            status={status}
            editable={!disabled}
            multiline={!!TextInputProps.multiline}
          />
        )}
      </View>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={$helperStyles}
        />
      )}
    </TouchableOpacity>
  );
});

const $labelStyle: TextStyle = {
  marginBottom: spacing.xxs,
};

const $inputWrapperStyle: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing.xs,
  backgroundColor: colors.palette.neutral200,
  borderWidth: StyleSheet.hairlineWidth,
  borderRadius: borderRadius.sm,
  minHeight: 38,
  justifyContent: "center",
  borderColor: colors.border,
};

const $inputStyle: TextStyle = {
  flex: 1,
  alignSelf: "stretch",
  color: colors.text,
  fontSize: $fontSizeStyles.sm.fontSize,
  // @ts-ignore
  outlineStyle: "none",
};

const $helperStyle: TextStyle = {
  marginTop: spacing.xs,
};

const $rightAccessoryStyle: ViewStyle = {
  marginEnd: spacing.xs,
  justifyContent: "center",
  alignItems: "center",
};
const $leftAccessoryStyle: ViewStyle = {
  marginStart: spacing.xs,
  justifyContent: "center",
  alignItems: "center",
};

const $errorStyle: ViewStyle = {
  borderColor: colors.error,
};
