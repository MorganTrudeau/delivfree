import React, { forwardRef } from "react";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { ModalRef } from "app/utils/types";
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
