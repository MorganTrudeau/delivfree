import React, { useMemo } from "react";
import { $row } from "./styles";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text } from "./Text";
import { ButtonSmall } from "./ButtonSmall";
import { Icon } from "./Icon";
import { spacing } from "app/theme";

interface Props {
  title: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

export const ScreenHeader = ({ title, buttonTitle, onButtonPress }: Props) => {
  const PlusIcon = useMemo(
    () =>
      ({ style }) =>
        <Icon icon="plus" color={"#fff"} style={style} />,
    []
  );

  return (
    <View style={$style}>
      <Text preset="heading">{title}</Text>
      {!!(buttonTitle && onButtonPress) && (
        <ButtonSmall
          LeftAccessory={PlusIcon}
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
