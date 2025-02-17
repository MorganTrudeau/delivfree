import React, { ComponentType, useMemo } from "react";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { colors, spacing, typography } from "../theme";
import { Text, TextProps } from "./Text";
import { Icon, IconTypes } from "./Icon";
import { borderRadius } from "app/theme/borderRadius";

type Presets = keyof typeof $viewPresets;

export interface ButtonAccessoryProps {
  style: StyleProp<any>;
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"];
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"];
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"];
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>;
  /**
   * One of the different types of button presets.
   */
  preset?: Presets;
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * Children components.
   */
  children?: React.ReactNode;

  leftIcon?: IconTypes;
  rightIcon?: IconTypes;
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.md)
 */
export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    leftIcon,
    rightIcon,
    ...rest
  } = props;

  const preset: Presets =
    props.preset && $viewPresets[props.preset] ? props.preset : "default";
  const $viewStyle: StyleProp<ViewStyle> = useMemo(
    () => [$viewPresets[preset], $viewStyleOverride],
    [$viewStyleOverride, preset]
  );
  const $textStyle: StyleProp<TextStyle> = useMemo(
    () => [$textPresets[preset], $textStyleOverride],
    [$textStyleOverride, preset]
  );

  const LeftIcon = useMemo(
    () =>
      leftIcon ? <Icon icon={leftIcon} style={$leftAccessoryStyle} /> : null,
    [leftIcon]
  );

  const RightIcon = useMemo(
    () =>
      rightIcon ? <Icon icon={rightIcon} style={$rightAccessoryStyle} /> : null,
    [rightIcon]
  );

  return (
    <Pressable style={$viewStyle} role="button" {...rest}>
      {LeftIcon}

      {!!LeftAccessory && <LeftAccessory style={$leftAccessoryStyle} />}

      <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle}>
        {children}
      </Text>

      {!!RightAccessory && <RightAccessory style={$rightAccessoryStyle} />}

      {RightIcon}
    </Pressable>
  );
}

const $baseViewStyle: ViewStyle = {
  minHeight: 56,
  borderRadius: borderRadius.sm,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  overflow: "hidden",
};

const $baseTextStyle: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.primary.medium,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
};

const $rightAccessoryStyle: ViewStyle = { marginStart: spacing.xs, zIndex: 1 };
const $leftAccessoryStyle: ViewStyle = { marginEnd: spacing.xs, zIndex: 1 };

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.palette.neutral300,
    },
  ] as StyleProp<ViewStyle>,

  filled: [
    $baseViewStyle,
    { backgroundColor: colors.palette.primary500 },
  ] as StyleProp<ViewStyle>,

  reversed: [
    $baseViewStyle,
    { backgroundColor: colors.palette.neutral800 },
  ] as StyleProp<ViewStyle>,
};

const $textPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: $baseTextStyle,
  filled: [$baseTextStyle, { color: colors.palette.neutral100 }],
  reversed: [$baseTextStyle, { color: colors.palette.neutral100 }],
};
