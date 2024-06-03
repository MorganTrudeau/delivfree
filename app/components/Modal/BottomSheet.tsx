import React, {
  ReactNode,
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Portal } from "react-native-portalize";
import GHMBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import { Platform, ViewStyle } from "react-native";
import { colors } from "app/theme";
import ReanimatedCenterModal, { ModalRef } from "./CenterModal";

const snapPoints = ["92%"];

type Props = Partial<Omit<BottomSheetProps, "children">> & {
  children: ReactNode | ReactNode[];
};

export type BottomSheetRef = GHMBottomSheet;

const BottomSheetWithoutRef = (
  { children, ...rest }: Props,
  ref: Ref<GHMBottomSheet>
) => {
  console.log("MOVEI");
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        pressBehavior={!rest.enablePanDownToClose ? "none" : "close"}
        enableTouchThrough={false}
        disappearsOnIndex={-1}
        opacity={0.3}
      />
    ),
    []
  );

  return (
    <Portal>
      <GHMBottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableContentPanningGesture
        enableHandlePanningGesture
        backdropComponent={renderBackdrop}
        backgroundStyle={$backgroundStyle}
        {...rest}
      >
        {children}
      </GHMBottomSheet>
    </Portal>
  );
};

const BottomSheetWeb = forwardRef<BottomSheetRef, Props>(
  function BottomSheetWeb(props, ref) {
    const modal = useRef<ModalRef>(null);

    console.log("RENDER");

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
      <ReanimatedCenterModal ref={modal}>
        {props.children}
      </ReanimatedCenterModal>
    );
  }
);

export const BottomSheet = Platform.select({
  web: BottomSheetWeb,
  default: forwardRef(BottomSheetWithoutRef),
});

const $backgroundStyle: ViewStyle = {
  backgroundColor: colors.background,
  elevation: 10,
  shadowOpacity: 0.1,
  shadowColor: "black",
};
