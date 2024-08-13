import React, {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { BottomSheetRef } from "../../../../components/Modal/BottomSheet";
import ReanimatedCenterModal from "../../../../components/Modal/CenterModal";
import { ModalRef } from "app/utils/types";
import { BottomSheetProps } from "@gorhom/bottom-sheet";

type Props = Partial<Omit<BottomSheetProps, "children">> & {
  children: ReactNode | ReactNode[];
};

export const BottomSheet = forwardRef<BottomSheetRef, Props>(
  function BottomSheetWeb(props, ref) {
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
        close,
        collapse: close,
        forceClose: close,
      }),
      []
    );

    return (
      <ReanimatedCenterModal
        ref={modal}
        tapToClose={props.enablePanDownToClose}
        onDismiss={props.onClose}
      >
        {props.children}
      </ReanimatedCenterModal>
    );
  }
);
