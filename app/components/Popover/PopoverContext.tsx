import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated } from "react-native";
import DismissView, { DismissViewRef } from "../DismissView";
import { useDimensions } from "app/hooks/useDimensions";
import { spacing } from "app/theme";

/* eslint-disable */
export const PopoverContext = createContext({
  showPopover: (
    measurement: Measurement,
    render: () => React.ReactNode,
    position: PopoverPosition
  ) => {},
  dismissPopover: () => {},
});
/* eslint-enable */

type Props = { children: React.ReactNode };
type PopoverPosition = "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
type Measurement = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

const defaultState = {
  measurement: null,
  renderPopover: null,
  position: "bottomRight" as PopoverPosition,
};

const PopoverProvider = ({ children }: Props) => {
  const dismissView = useRef<null | DismissViewRef>(null);

  const { width, height } = useDimensions();

  const [{ measurement, renderPopover, position }, setState] = useState<{
    measurement: Measurement | null;
    renderPopover: null | (() => React.ReactNode);
    position: PopoverPosition;
  }>(defaultState);

  const [popoverLayout, setPopoverLayout] = useState<
    | {
        height: number;
        width: number;
      }
    | undefined
  >();

  const showPopover = (
    measurement: Measurement,
    render: () => React.ReactNode,
    position: PopoverPosition
  ) => {
    setState({ measurement, renderPopover: render, position });
  };

  const dismissPopover = () => {
    dismissView.current && dismissView.current.dismiss();
  };

  const handleClosed = () => {
    requestAnimationFrame(() => setState(defaultState));
  };

  useEffect(() => {
    if (renderPopover) {
      dismissView.current && dismissView.current.show();
    }
  }, [renderPopover]);

  // @ts-ignore
  const popoverStyle: {
    position: "absolute";
    bottom?: number;
    left?: number;
    top?: number;
    right?: number;
  } = useMemo(() => {
    if (!(popoverLayout && measurement)) {
      return { postion: "absolute" };
    }
    switch (position) {
      case "bottomRight":
        return {
          position: "absolute",
          bottom: height - measurement.pageY - measurement.height / 2,
          right: width - measurement.pageX - measurement.width / 2,
        };
      case "bottomLeft":
        return {
          position: "absolute",
          bottom: height - measurement.pageY - measurement.height / 2,
          left: measurement.pageX + measurement.width / 2,
        };
      case "topRight":
        return {
          position: "absolute",
          top: measurement.pageY + measurement.height / 2,
          right: width - measurement.pageX - measurement.width / 2,
        };
      case "topLeft":
        return {
          position: "absolute",
          top: measurement.pageY + measurement.height + spacing.xxs,
          left: measurement.pageX,
        };
      default:
        return { position: "absolute" };
    }
  }, [popoverLayout, measurement, height, width, position]);

  const handlePopoverLayout = ({ nativeEvent: { layout } }: any) => {
    setPopoverLayout(layout);
  };

  const contextValue = useMemo(() => ({ showPopover, dismissPopover }), []);

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
      {renderPopover && (
        <DismissView ref={dismissView} opacity={0.1} onDismiss={handleClosed}>
          <Animated.View
            onLayout={!popoverLayout ? handlePopoverLayout : undefined}
            style={popoverStyle}
            pointerEvents={"box-none"}
          >
            {renderPopover()}
          </Animated.View>
        </DismissView>
      )}
    </PopoverContext.Provider>
  );
};

export default PopoverProvider;
