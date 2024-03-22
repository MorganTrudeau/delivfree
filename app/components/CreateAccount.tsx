import React, { useEffect, useRef } from "react";
import { useAppSelector } from "app/redux/store";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "./Text";
import { Icon } from "./Icon";
import { sizing } from "app/theme/sizing";
import { colors, spacing } from "app/theme";
import { AuthModal } from "./AuthModal";
import { ModalRef } from "delivfree";

export const CreateAccount = ({ style }: { style?: ViewStyle }) => {
  const authModal = useRef<ModalRef>(null);

  const isAnonymous = useAppSelector((state) => state.auth.isAnonymous);

  useEffect(() => {
    if (authModal.current?.isOpen() && !isAnonymous) {
      authModal.current?.close();
    }
  }, [isAnonymous]);

  return (
    <>
      {isAnonymous && (
        <Pressable
          style={[$button, style]}
          onPress={() => authModal.current?.open()}
        >
          <Icon icon="account-plus" size={sizing.xl} style={$icon} />
          <View style={$textContainer}>
            <Text weight="semiBold" size={"sm"}>
              Create account
            </Text>
            <Text size={"xs"}>Save your progress, coins, and powerups</Text>
          </View>
        </Pressable>
      )}
      <AuthModal ref={authModal} />
    </>
  );
};

const $button: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderRadius: 4,
  borderColor: colors.border,
  borderWidth: 2,
};

const $textContainer: ViewStyle = {
  flex: 1,
};

const $icon: TextStyle = {
  marginEnd: spacing.md,
};
