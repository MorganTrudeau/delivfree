import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { BottomSheetRef } from "./BottomSheet";
import ReanimatedCenterModal, { ModalRef } from "./CenterModal";

export const BottomSheet = forwardRef<
  BottomSheetRef,
  { children: React.ReactNode; enablePanDownToClose?: boolean }
>(function BottomSheetWeb(props, ref) {
  const modal = useRef<ModalRef>(null);

  const open = () => {
    modal.current?.open();
  };
  const close = () => modal.current?.close();

  useImperativeHandle(
    ref,
    () => ({
      snapToIndex: open,
      snapToPosition: open,
      expand: open,
      close: close,
      collapse: close,
      forceClose: close,
    }),
    []
  );

  return (
    <ReanimatedCenterModal ref={modal} tapToClose={props.enablePanDownToClose}>
      {props.children}
    </ReanimatedCenterModal>
  );
});
