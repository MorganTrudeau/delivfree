import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, View, ViewStyle, ActivityIndicator } from "react-native";
import { colors, spacing } from "app/theme";
import { Text } from "./Text";
import { MAX_USERNAME_LENGTH, ModalRef } from "smarticus";
import ConfirmCancelButtons from "./ConfirmCancelButtons";
import { useEditUsername } from "app/hooks";
import { TextField } from "./TextField";
import { ReanimatedModal } from "./Modal/ReanimatedModal";

export type TextInputModalRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  initialValue: string;
  title: string;
  placeholder: string;
  onConfirm: (val: string) => void;
  onCancel?: () => void;
  loading?: boolean;
};

const TextInputModalNoMemo = forwardRef<TextInputModalRef, Props>(
  function TextInputModal(
    { initialValue, title, placeholder, onConfirm, onCancel, loading },
    ref
  ) {
    const modalRef = useRef<ModalRef>(null);

    const onClose = useCallback(() => {
      Keyboard.dismiss();
    }, []);

    const open = () => {
      modalRef.current?.open();
    };

    const close = () => {
      modalRef.current?.close();
      if (onCancel) {
        onCancel();
      }
    };

    useImperativeHandle(ref, () => ({ open, close }));

    return (
      <ReanimatedModal ref={modalRef} onDismiss={onClose} showCloseButton>
        <View style={$container}>
          <Text preset="subheading">{title}</Text>
          <Input
            initialValue={initialValue}
            onConfirm={onConfirm}
            onCancel={close}
            placeholder={placeholder}
            loading={loading}
          />
        </View>
      </ReanimatedModal>
    );
  }
);

const Input = React.memo(function Input({
  initialValue,
  placeholder,
  onConfirm,
  onCancel,
  loading,
}: {
  initialValue: string;
  placeholder: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const [value, setValue] = useState(initialValue);

  const {
    onUsernameChanged,
    validateUsernameUpdate,
    usernameUnavailable,
    checkingAvailability,
  } = useEditUsername(initialValue, value, setValue);

  const handleConfirm = () => {
    const newValue = value.trim();
    if (!validateUsernameUpdate(newValue)) {
      return;
    }
    onConfirm(newValue);
  };

  const CheckingAvailability = useMemo(
    () =>
      checkingAvailability
        ? () => <ActivityIndicator color={colors.primary} />
        : undefined,
    [checkingAvailability]
  );

  return (
    <>
      <TextField
        value={value}
        onChangeText={onUsernameChanged}
        placeholder={placeholder}
        onSubmitEditing={handleConfirm}
        autoComplete={"off"}
        autoCapitalize={"words"}
        autoCorrect={false}
        RightAccessory={CheckingAvailability}
        maxLength={MAX_USERNAME_LENGTH}
      />
      <Text style={usernameUnavailable ? $errorText : undefined} size={"xxs"}>
        {usernameUnavailable ? "Username unavailable" : ""}
      </Text>
      <ConfirmCancelButtons
        onConfirm={handleConfirm}
        onCancel={onCancel}
        loading={loading}
      />
    </>
  );
});

export const TextInputModal = React.memo(TextInputModalNoMemo);

const $container: ViewStyle = {
  padding: spacing.md,
};
const $errorText = { color: colors.error, marginTop: spacing.xxs };
