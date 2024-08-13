import React, { forwardRef, useCallback, useState } from "react";
import {
  DeliveryInstructions,
  DeliveryInstructionsType,
} from "delivfree";
import { Pressable, View } from "react-native";
import { Text } from "../Text";
import { Toggle } from "../Toggle";
import { getDeliveryInstructionsTitle } from "app/utils/checkout";
import { Button } from "../Button";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { ModalRef } from "app/utils/types";
import { ModalCloseButton } from "../Modal/ModalCloseButton";
import { updateUser } from "app/apis/user";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { $flexRowBetween } from "../styles";
import { borderRadius } from "app/theme/borderRadius";
import { colors, spacing } from "app/theme";

interface Props {
  user: string;
  deliveryInstructions: DeliveryInstructions | null | undefined;
  onClose: () => void;
}

const ManageDeliveryInstructions = ({
  user,
  deliveryInstructions,
  onClose,
}: Props) => {
  const [deliveryInstructionsState, setDeliveryInstructionsState] =
    useState<DeliveryInstructions>(
      deliveryInstructions || { type: "meet-door", note: "" }
    );

  const updateType = (type: DeliveryInstructionsType) => () => {
    setDeliveryInstructionsState((s) => ({ ...s, type }));
  };

  const handleUpdateDeliveryInstructions = useCallback(
    async (deliveryInstructions: DeliveryInstructions) => {
      await updateUser(user, { deliveryInstructions });
      onClose();
    },
    []
  );

  const { exec: updateInstructions, loading } = useAsyncFunction(
    handleUpdateDeliveryInstructions
  );

  const Loading = useLoadingIndicator(loading, { color: "#fff" });

  return (
    <View style={{ padding: spacing.md }}>
      <Text preset={"subheading"} style={{ marginBottom: spacing.md }}>
        Delivery instructions
      </Text>

      <ModalCloseButton onPress={onClose} />

      <Option
        title={getDeliveryInstructionsTitle("meet-door")}
        enabled={deliveryInstructionsState.type === "meet-door"}
        onPress={updateType("meet-door")}
      />
      <Option
        title={getDeliveryInstructionsTitle("meet-lobby")}
        enabled={deliveryInstructionsState.type === "meet-lobby"}
        onPress={updateType("meet-lobby")}
      />
      <Option
        title={getDeliveryInstructionsTitle("meet-outside")}
        enabled={deliveryInstructionsState.type === "meet-outside"}
        onPress={updateType("meet-outside")}
      />

      <Button
        preset="reversed"
        text="Update instructions"
        onPress={() => updateInstructions(deliveryInstructionsState)}
        RightAccessory={Loading}
        style={{ marginTop: spacing.md }}
      />
    </View>
  );
};

export const DeliveryInstructionsModal = forwardRef<ModalRef, Props>(
  function DeliveryInstructionsModal(props, ref) {
    return (
      <ReanimatedCenterModal ref={ref}>
        <ManageDeliveryInstructions {...props} />
      </ReanimatedCenterModal>
    );
  }
);

const Option = ({
  title,
  enabled,
  onPress,
}: {
  title: string;
  enabled: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        $flexRowBetween,
        {
          borderRadius: borderRadius.md,
          backgroundColor: enabled ? colors.surface : undefined,
          padding: spacing.sm,
        },
      ]}
    >
      <Text>{title}</Text>
      <Toggle value={enabled} />
    </Pressable>
  );
};
