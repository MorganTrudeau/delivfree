import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
  }, []);

  return dimensions;
};
