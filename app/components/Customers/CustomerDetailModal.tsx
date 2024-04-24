import { spacing } from "app/theme";
import { Customer } from "functions/src/types";
import React, { forwardRef } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import { ButtonSmall } from "../ButtonSmall";
import { navigateToAddress } from "app/utils/general";

interface Props {
  customer: Customer | null | undefined;
}

const CustomerDetail = ({ customer }: Props) => {
  return (
    <View style={$content}>
      <Text preset="subheading">Customer Details</Text>
      <Text preset="formLabel" style={$label}>
        Name
      </Text>
      <Text>{customer?.name}</Text>
      <Text preset="formLabel" style={$label}>
        Phone number
      </Text>
      <Text>{customer?.phoneNumber}</Text>
      <Text preset="formLabel" style={$label}>
        Address
      </Text>
      <Text>{customer?.location.address}</Text>
      <ButtonSmall
        style={{ alignSelf: "flex-start", marginTop: spacing.xs }}
        text="Navigate"
        onPress={() => {
          if (!customer) {
            return;
          }
          navigateToAddress(
            customer.location.latitude,
            customer.location.longitude,
            customer.location.address
          );
        }}
      />
    </View>
  );
};

export const CustomerDetailModal = forwardRef<
  ModalRef,
  Props & { onDismiss: () => void }
>(function CustomerDetailModal({ onDismiss, ...rest }, ref) {
  return (
    <ReanimatedCenterModal ref={ref} onDismiss={onDismiss}>
      <CustomerDetail {...rest} />
    </ReanimatedCenterModal>
  );
});

const $content: ViewStyle = {
  padding: spacing.md,
};
const $label: TextStyle = { marginTop: spacing.sm };
