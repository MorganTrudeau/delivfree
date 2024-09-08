import React, { useCallback, useMemo, useRef } from "react";
import { CalendarModal, CalendarModalProps } from "./CalendarModal";
import { Pressable, ViewStyle } from "react-native";
import moment from "moment";
import { Text } from "../Text";
import { $borderedArea } from "../styles";
import { ModalRef } from "delivfree";

export const CalendarButton = ({
  style,
  date,
  ...rest
}: Omit<CalendarModalProps, "onCancel"> & { style?: ViewStyle }) => {
  const calendar = useRef<ModalRef>(null);
  const formattedDate = useMemo(() => {
    return moment(date).format("LL");
  }, [date]);
  const handleCancel = useCallback(() => {
    calendar.current?.close();
  }, []);
  return (
    <>
      <Pressable
        style={[$borderedArea, style]}
        onPress={() => calendar.current?.open()}
      >
        <Text>{formattedDate}</Text>
      </Pressable>
      <CalendarModal
        ref={calendar}
        date={date}
        onCancel={handleCancel}
        {...rest}
      />
    </>
  );
};
