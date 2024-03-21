import React from "react";
import {
  ActivityIndicator,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";

type Props = {
  cancelTitle?: string;
  confirmTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  style?: ViewStyle;
};

export const ConfirmCancelButtons = ({
  cancelTitle,
  confirmTitle,
  onConfirm,
  onCancel,
  loading,
  style,
}: Props) => {
  //   useKeyPress("Enter", onConfirm);

  return (
    <View style={[$container, style]}>
      <TextButton
        text={cancelTitle || "Cancel"}
        onPress={onCancel}
        style={$cancelButton}
      />
      <TextButton
        text={confirmTitle || "Confirm"}
        onPress={onConfirm}
        loading={loading}
      />
    </View>
  );
};

const TextButton = ({
  text,
  onPress,
  style,
  loading,
  textStyle,
}: {
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean;
  textStyle?: TextStyle;
}) => {
  return (
    <Pressable onPress={onPress} style={[$textButton, style]}>
      <Text weight="medium" style={textStyle}>
        {text}
      </Text>
      {loading && <ActivityIndicator color={colors.primary} style={$loading} />}
    </Pressable>
  );
};

export default ConfirmCancelButtons;

const $container: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  marginTop: spacing.sm,
};
const $textButton: ViewStyle = { flexDirection: "row", alignItems: "center" };
const $cancelButton: ViewStyle = {
  marginEnd: 30,
};
const $loading: ViewStyle = {
  marginStart: spacing.xxs,
};
// const $confirmText: TextStyle = {
//   color: colors.primary,
// };
// const $cancelText: TextStyle = {
//   color: colors.textDim,
// };
