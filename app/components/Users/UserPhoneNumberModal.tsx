import { spacing } from "app/theme";
import React, { forwardRef, useCallback, useState } from "react";
import { View } from "react-native";
import { PhoneNumberInput } from "../PhoneNumberInput";
import { useAppSelector } from "app/redux/store";
import { CountryCode } from "delivfree/types";
import { Button } from "../Button";
import { updateUser } from "app/apis/user";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";

type Props = { onClose: () => void };

export const UserPhoneNumber = ({ onClose }: Props) => {
  const user = useAppSelector((state) => state.user.user);
  const userId = user?.id;

  const [{ phoneNumber, callingCode, callingCountry }, setState] = useState<{
    callingCountry: CountryCode;
    callingCode: string;
    phoneNumber: string;
  }>({
    phoneNumber: user?.phoneNumber || "",
    callingCode: user?.callingCode || "+1",
    callingCountry: user?.callingCountry || "CA",
  });

  const updatePhoneNumber = useCallback(async () => {
    if (!userId) {
      throw "missing-user";
    }
    await updateUser(userId, { phoneNumber, callingCode, callingCountry });
    onClose();
  }, [phoneNumber, callingCode, callingCountry, userId]);

  const { exec, loading } = useAsyncFunction(updatePhoneNumber);
  const Loading = useLoadingIndicator(loading);

  return (
    <View style={{ padding: spacing.md }}>
      <PhoneNumberInput
        callingCountry={callingCountry}
        value={phoneNumber}
        onChangeCallingCode={(callingCode, callingCountry) =>
          setState((s) => ({ ...s, callingCode, callingCountry }))
        }
        onChangeText={(phoneNumber) => {
          setState((s) => ({ ...s, phoneNumber }));
        }}
        label={"Phone number"}
      />
      <Button
        preset={phoneNumber ? "reversed" : "default"}
        disabled={!phoneNumber}
        onPress={exec}
        RightAccessory={Loading}
        style={{ marginTop: spacing.md }}
        text="Confirm phone number"
      />
    </View>
  );
};

export const UserPhoneNumberModal = forwardRef<ModalRef, Props>(
  function UserPhoneNumberModal(props, ref) {
    return (
      <ReanimatedCenterModal ref={ref}>
        <UserPhoneNumber {...props} />
      </ReanimatedCenterModal>
    );
  }
);
