import React from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../Text";
import { spacing } from "app/theme";

type Props = {
  text: string;
  visible: boolean;
  topOffset?: number;
};

const Toast = ({ text, visible, topOffset }: Props) => {
  const insets = useSafeAreaInsets();

  return visible ? (
    <View
      style={[
        $toast,
        {
          top: topOffset || 20 + insets.top,
        },
      ]}
    >
      <Text style={$text}>{text}</Text>
    </View>
  ) : null;
};

const $text = { color: "#fff" };

const $toast: ViewStyle = {
  backgroundColor: "black",
  padding: 15,
  position: "absolute",
  alignSelf: "center",
  marginRight: spacing.md,
  marginLeft: spacing.md,
  borderRadius: 5,
  zIndex: 9999,
};

export default Toast;
