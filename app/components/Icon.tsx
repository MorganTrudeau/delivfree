import * as React from "react";
import {
  ColorValue,
  Pressable,
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { IconName } from "delivfree";
import { colors } from "app/theme";
import { sizing } from "app/theme/sizing";

export type IconTypes = IconName | keyof typeof iconRegistry | undefined;

export interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes;

  /**
   * An optional tint color for the icon
   */
  color?: string | ColorValue;

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number;

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<TextStyle>;

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"];
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export const Icon = React.memo((props: IconProps) => {
  const {
    icon,
    color = colors.text,
    size = sizing.lg,
    style,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props;

  const isPressable = !!WrapperProps.onPress;

  return (
    <Pressable
      disabled={!isPressable}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <MaterialIcon
        style={style}
        size={size}
        color={color}
        // @ts-ignore
        name={iconRegistry[icon] || icon}
      />
    </Pressable>
  );
});

export const iconRegistry = {
  back: "arrow-left",
  bell: "bell-ring",
  caretLeft: "chevron-left",
  caretRight: "chevron-right",
  check: "check",
  clap: "hand-clap",
  community: "account-group",
  components: "code-array",
  debug: "bug",
  github: "github",
  heart: "heart",
  hidden: "eye-off",
  ladybug: "bug",
  lock: "lock",
  menu: "menu",
  more: "dots-horizontal",
  pin: "map-marker",
  podcast: "podcast",
  settings: "cog",
  slack: "slack",
  view: "eye",
  x: "close",
} as const;
