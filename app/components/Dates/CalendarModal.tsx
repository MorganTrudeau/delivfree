import React, { forwardRef } from "react";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { ModalRef } from "delivfree";
import AppCalendar, { Props } from "./AppCalendar";

export type CalendarModalProps = Props;

export const CalendarModal = forwardRef<ModalRef, Props>(function CalendarModal(
  props,
  ref
) {
  return (
    <ReanimatedCenterModal ref={ref} contentStyle={{ maxWidth: 400 }}>
      <AppCalendar {...props} />
    </ReanimatedCenterModal>
  );
});
