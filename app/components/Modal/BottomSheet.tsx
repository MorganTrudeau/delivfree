import React, {
  ReactNode,
  Ref,
  forwardRef,
  useCallback,
  useState,
} from "react";
import { Portal } from "react-native-portalize";
import GHMBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import { ViewStyle } from "react-native";
import { colors } from "app/theme";
import { InteractionManagerView } from "../InteractionManagerView";

const snapPoints = ["92%"];

type Props = Partial<Omit<BottomSheetProps, "children">> & {
  children: ReactNode | ReactNode[];
};

export type BottomSheetRef = GHMBottomSheet;

const BottomSheetWithoutRef = (
  { children, ...rest }: Props,
  ref: Ref<GHMBottomSheet>
) => {
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
        <InteractionManagerView>{children}</InteractionManagerView>
      </GHMBottomSheet>
    </Portal>
  );
};

export const BottomSheet = forwardRef(BottomSheetWithoutRef);

const $backgroundStyle: ViewStyle = {
  backgroundColor: colors.background,
  elevation: 10,
  shadowOpacity: 0.1,
  shadowColor: "black",
};
