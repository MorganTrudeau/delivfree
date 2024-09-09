import React, { forwardRef } from "react";
import ReanimatedCenterModal from "../Modal/CenterModal";
import {
  ConsumerRegistration,
  ConsumerRegistrationProps,
} from "./ConsumerRegistration";
import { ModalRef } from "delivfree";
import { View } from "react-native";
import { spacing } from "app/theme";

export const ConsumerRegistrationModal = forwardRef<
  ModalRef,
  ConsumerRegistrationProps
>(function ConsumerRegistrationModal(props, ref) {
  return (
    <ReanimatedCenterModal ref={ref}>
      <View style={{ padding: spacing.md }}>
        <ConsumerRegistration {...props} />
      </View>
    </ReanimatedCenterModal>
  );
});
