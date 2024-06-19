import moment, { MomentInput } from "moment";
import React, { useCallback, useMemo, useRef } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { TimePickerModal, Props as TimePickerProps } from "./TimePickerModal";
import { ModalRef } from "../Modal/CenterModal";
import { $formLabel, $input } from "../styles";
import { Text } from "../Text";
import { colors } from "app/theme";

type Props = {
  time: MomentInput;
  initialTime: MomentInput;
  onChangeTime: (date: Date) => void;
  title: string;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  modalProps?: Partial<TimePickerProps>;
};

const AppTimeInput = ({
  time,
  initialTime,
  style,
  title,
  onChangeTime,
  modalProps,
  inputStyle,
}: Props) => {
  const modal = useRef<ModalRef>(null);
  const formattedTime = useMemo(
    () => (time ? moment(time).format("hh:mma") : ""),
    [time]
  );

  const handleCancel = useCallback(() => {
    modal.current?.close();
  }, []);
  const handleConfirm = useCallback((date: Date) => {
    modal.current?.close();
    onChangeTime(date);
  }, []);

  return (
    <View style={style}>
      <Text preset="formLabel" style={$formLabel}>
        {title}
      </Text>
      <Pressable
        onPress={() => {
          modal.current?.open();
        }}
        style={[$input, { minWidth: 130 }, inputStyle]}
      >
        <Text style={{ color: formattedTime ? colors.text : colors.textDim }}>
          {formattedTime || title}
        </Text>
      </Pressable>
      <TimePickerModal
        {...modalProps}
        ref={modal}
        time={time}
        initialTime={initialTime}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        label={title}
      />
    </View>
  );
};

export default AppTimeInput;
