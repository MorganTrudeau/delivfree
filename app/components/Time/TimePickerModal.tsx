import React, { forwardRef } from "react";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import { TimePicker, Props as TimePickerProps } from "./TimerPicker";

export type Props = TimePickerProps;

export const TimePickerModal = forwardRef<ModalRef, TimePickerProps>(
  function TimePickerModal(props, ref) {
    return (
      <ReanimatedCenterModal ref={ref}>
        <TimePicker {...props} />
      </ReanimatedCenterModal>
    );
  }
);
