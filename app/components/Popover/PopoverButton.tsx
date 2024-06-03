import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { PopoverContext } from "./PopoverContext";

export interface PopoverRef {
  dismiss: () => void;
}
export type Props = {
  children: React.ReactElement;
  renderPopover: () => React.ReactElement;
  position?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
  style?: ViewStyle;
};

export const PopoverButton = forwardRef<PopoverRef, Props>(function Popover(
  { children, renderPopover, position = "topLeft", style },
  ref
) {
  const popoverRef = useRef<TouchableOpacity | null>(null);

  const popoverContext = useContext(PopoverContext);

  const showPopover = () => {
    popoverRef.current &&
      popoverRef.current.measure((x, y, width, height, pageX, pageY) => {
        const measurement = { x, y, width, height, pageX, pageY };
        popoverContext.showPopover(measurement, renderPopover, position);
      });
  };

  useImperativeHandle(ref, () => ({
    dismiss: () => popoverContext?.dismissPopover(),
  }));

  return (
    <TouchableOpacity
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      onPress={showPopover}
      ref={popoverRef}
      activeOpacity={1}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
});
