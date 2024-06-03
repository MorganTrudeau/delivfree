import React, { ComponentType, ReactNode, useMemo } from "react";
import { $row } from "./styles";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text } from "./Text";
import { ButtonSmall, ButtonSmallAccessoryProps } from "./ButtonSmall";
import { Icon } from "./Icon";
import { spacing } from "app/theme";
import { sizing } from "app/theme/sizing";

interface Props {
  title: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  RightAccessory?: ComponentType<ButtonSmallAccessoryProps>;
  hideIcon?: boolean;
}

export const ScreenHeader = ({
  title,
  buttonTitle,
  onButtonPress,
  RightAccessory,
  hideIcon,
}: Props) => {
  const PlusIcon = useMemo(
    () =>
      hideIcon ? (
        <View style={{ height: sizing.lg }} />
      ) : (
        ({ style }) => <Icon icon="plus" color={"#fff"} style={style} />
      ),
    [hideIcon]
  );

  return (
    <View style={$style}>
      <Text preset="heading">{title}</Text>
      {!!(buttonTitle && onButtonPress) && (
        <ButtonSmall
          LeftAccessory={PlusIcon}
          RightAccessory={RightAccessory}
          text={buttonTitle}
          preset="filled"
          onPress={onButtonPress}
        />
      )}
    </View>
  );
};

const $style: StyleProp<ViewStyle> = [
  $row,
  { justifyContent: "space-between", paddingBottom: spacing.md },
];
