import { avatarColors } from "app/theme";
import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  ViewStyle,
} from "react-native";
import { Icon } from "./Icon";

type ColorProps = {
  backgroundColor: string;
  onColorChange: (color: string) => void;
  size: number;
  selected: boolean;
};

const Color = ({
  backgroundColor,
  onColorChange,
  size,
  selected,
}: ColorProps) => (
  <TouchableWithoutFeedback onPress={onColorChange.bind(null, backgroundColor)}>
    <View
      style={[
        $color,
        {
          backgroundColor,
          height: size,
          width: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {selected && <Icon color={"#fff"} size={size - 15} icon={"check"} />}
    </View>
  </TouchableWithoutFeedback>
);

type ColorPickerProps = {
  currentColor?: string;
  onColorChange: (color: string) => void;
  style?: ViewStyle;
};

const ColorPicker = ({
  currentColor,
  onColorChange,
  style,
}: ColorPickerProps) => {
  const colorsLength = avatarColors.length;
  const size = 40;
  const renderColors = (colors: string[]) => {
    return colors.map((color) => (
      <Color
        key={color}
        backgroundColor={color}
        onColorChange={onColorChange}
        selected={currentColor === color}
        size={size}
      />
    ));
  };
  return (
    <View style={style}>
      <View style={$colorRow}>
        {renderColors(avatarColors.slice(0, colorsLength / 2))}
      </View>
      <View style={$colorRow}>
        {renderColors(avatarColors.slice(colorsLength / 2, colorsLength))}
      </View>
    </View>
  );
};

const $colorRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginVertical: Platform.select({ default: 5, web: 10 }),
};

const $color: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
};

export default ColorPicker;
