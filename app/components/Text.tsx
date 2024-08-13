import i18n from "i18n-js";
import React from "react";
import {
  StyleProp,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";
import { isRTL, translate, TxKeyPath } from "../i18n";
import { colors, typography, fontSize } from "../theme";

type Sizes = keyof typeof fontSize;
type Weights = keyof typeof typography.primary;
type Presets = keyof typeof $presets;

export interface TextProps extends RNTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath;
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string;
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: i18n.TranslateOptions;
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>;
  /**
   * One of the different types of text presets.
   */
  preset?: Presets;
  /**
   * Text weight modifier.
   */
  weight?: Weights;
  /**
   * Text size modifier.
   */
  size?: Sizes;
  /**
   * Children components.
   */
  children?: React.ReactNode;
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Text.md)
 */
export function Text(props: TextProps) {
  const {
    weight,
    size,
    tx,
    txOptions,
    text,
    children,
    style: $styleOverride,
    ...rest
  } = props;

  const i18nText = tx && translate(tx, txOptions);
  const content = i18nText || text || children;

  const preset: Presets =
    props.preset && $presets[props.preset] ? props.preset : "default";
  const $styles = [
    $rtlStyle,
    $presets[preset],
    weight && $fontWeightStyles[weight],
    size && fontSize[size],
    $styleOverride,
  ];

  return (
    <RNText allowFontScaling={preset !== "heading"} {...rest} style={$styles}>
      {content}
    </RNText>
  );
}

const $fontWeightStyles = Object.entries(typography.primary).reduce(
  (acc, [weight, fontFamily]) => {
    return { ...acc, [weight]: { fontFamily } };
  },
  {}
) as Record<Weights, TextStyle>;

const $secondaryFontWeightStyles = Object.entries(typography.secondary).reduce(
  (acc, [weight, fontFamily]) => {
    return { ...acc, [weight]: { fontFamily } };
  },
  {}
) as Record<Weights, TextStyle>;

const $baseStyle: StyleProp<TextStyle> = [
  fontSize.sm,
  $fontWeightStyles.normal,
  { color: colors.text },
];

const $presets = {
  default: $baseStyle,

  semibold: [$baseStyle, $fontWeightStyles.semiBold] as StyleProp<TextStyle>,
  bold: [$baseStyle, $fontWeightStyles.bold] as StyleProp<TextStyle>,

  heading: [
    $baseStyle,
    fontSize.xxl,
    $secondaryFontWeightStyles.bold,
  ] as StyleProp<TextStyle>,

  subheading: [
    $baseStyle,
    fontSize.lg,
    $fontWeightStyles.medium,
  ] as StyleProp<TextStyle>,

  formLabel: [$baseStyle, $fontWeightStyles.medium] as StyleProp<TextStyle>,

  formHelper: [
    $baseStyle,
    fontSize.sm,
    $fontWeightStyles.normal,
  ] as StyleProp<TextStyle>,
};

const $rtlStyle: TextStyle = isRTL ? { writingDirection: "rtl" } : {};
