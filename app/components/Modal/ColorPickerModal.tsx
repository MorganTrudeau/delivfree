import React, { Ref, forwardRef } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import ColorPicker from "../ColorPicker";
import { spacing } from "app/theme";
import { Text } from "../Text";
import { ModalRef } from "smarticus";
import { ReanimatedModal } from "./ReanimatedModal";

type Props = {
  currentColor?: string;
  onColorChange: (color: string) => void;
};

const ColorPickerModalWithoutRef = (
  { currentColor, onColorChange }: Props,
  ref: Ref<ModalRef>
) => {
  return (
    <ReanimatedModal ref={ref} contentStyle={$colorPicker} showCloseButton>
      <View style={$header}>
        <Text preset="subheading">Choose a color</Text>
      </View>
      <ColorPicker currentColor={currentColor} onColorChange={onColorChange} />
    </ReanimatedModal>
  );
};

export const ColorPickerModal = forwardRef(ColorPickerModalWithoutRef);

const $header: TextStyle = {
  marginBottom: spacing.sm,
};

const $colorPicker: ViewStyle = {
  padding: spacing.md,
};

export default ColorPickerModal;
