import React from "react";
import { Text } from "./Text";
import { View } from "react-native";
import { colors } from "app/theme";

export const NumberBubble = ({ number }: { number: number }) => {
  return (
    <View
      style={{
        height: SIZE,
        width: SIZE,
        borderRadius: SIZE / 2,
        backgroundColor: number ? colors.primary : colors.disabled,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: number ? "#fff" : colors.textDim }}>{number}</Text>
    </View>
  );
};

const SIZE = 28;
