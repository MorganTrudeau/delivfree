import { useState } from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";

export const useLayout = () => {
  const [layout, setLayout] = useState<LayoutRectangle>();

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayout(event.nativeEvent.layout);
  };

  return { layout, handleLayout };
};
