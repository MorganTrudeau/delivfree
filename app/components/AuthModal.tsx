import React, { forwardRef } from "react";
import { ModalRef } from "delivfree";
import { SignUpForm } from "./Auth/SignUpForm";
import { ViewStyle } from "react-native";
import { spacing } from "app/theme";

import { ReanimatedModal } from "./Modal/ReanimatedModal";

export const AuthModal = forwardRef<ModalRef>(function AuthModal(props, ref) {
  return (
    <ReanimatedModal ref={ref} contentStyle={$container} showCloseButton>
      <SignUpForm />
    </ReanimatedModal>
  );
});

const $container: ViewStyle = { padding: spacing.lg };
