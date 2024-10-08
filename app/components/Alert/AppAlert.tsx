import React, { forwardRef } from "react";
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  AlertButton,
  ViewStyle,
} from "react-native";

import { colors, spacing } from "app/theme";
import { Icon, IconTypes } from "../Icon";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { ModalRef } from "app/utils/types";
import { Text } from "../Text";
import { $borderTop, $row, MAX_CENTER_MODAL_WIDTH } from "../styles";

type AppAlertButtonProps = {
  onPress: () => void;
  text: string | undefined;
  cancel?: boolean;
  loading?: boolean;
  success?: boolean;
  successIcon?: IconTypes;
  isPreferred?: boolean;
};

export const AppAlertButton = ({
  onPress,
  text,
  cancel,
  loading,
  success,
  successIcon,
  isPreferred,
}: AppAlertButtonProps) => {
  const color = cancel ? colors.error : colors.text;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[$borderTop, $row, { padding: 15 }]}>
        <Text
          preset={isPreferred ? "semibold" : "default"}
          style={{
            color,
            textAlign: "center",
            flex: 1,
          }}
        >
          {text}
        </Text>
        {!!loading && (
          <ActivityIndicator
            style={{ position: "absolute", right: 15 }}
            color={color}
          />
        )}
        {!loading && !!success && !!successIcon && (
          <Icon
            icon={successIcon}
            size={25}
            color={color}
            containerStyle={{ position: "absolute", right: 15 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const defaultButtons = [{ text: "OK" }];

type AlertContentProps = {
  onRequestClose?: () => void;
  buttons?: (AlertButton & { cancel?: boolean })[];
  title?: string;
  message?: string;
  customContentRenderer?: (() => React.ReactElement) | null;
  titleIcon?: IconTypes | null;
  renderAfterHeader?: (() => React.ReactElement | null) | null;
};

const AlertContent = ({
  onRequestClose,
  buttons = defaultButtons,
  title,
  message,
  customContentRenderer,
  titleIcon,
  renderAfterHeader,
}: AlertContentProps) => {
  return (
    <View style={{ paddingHorizontal: spacing.xs }}>
      {typeof customContentRenderer === "function" ? (
        customContentRenderer()
      ) : (
        <View style={{ padding: spacing.md, alignItems: "center" }}>
          <View style={$row}>
            <Text preset="subheading">{title}</Text>
            {!!titleIcon && (
              <Icon
                icon={titleIcon}
                color={colors.primary}
                size={25}
                style={{ marginLeft: 7 }}
              />
            )}
          </View>
          <Text style={{ marginTop: spacing.xxs, textAlign: "center" }}>
            {message}
          </Text>
        </View>
      )}
      {renderAfterHeader && renderAfterHeader()}
      {buttons.map((button, index) => (
        <AppAlertButton
          key={index.toString()}
          onPress={() => {
            typeof button.onPress === "function" && button.onPress();
            typeof onRequestClose === "function" && onRequestClose();
          }}
          text={button.text}
          cancel={button.cancel || button.style === "destructive"}
          isPreferred={button.isPreferred}
        />
      ))}
    </View>
  );
};

type AppAlertProps = AlertContentProps & {
  tapToDismiss?: boolean;
};

const AppAlert = forwardRef<ModalRef, AppAlertProps>(function AppAlert(
  props,
  ref
) {
  const { onRequestClose, tapToDismiss, ...rest } = props;

  return (
    <ReanimatedCenterModal
      ref={ref}
      tapToClose={tapToDismiss}
      modalStyle={$modalStyle}
      contentStyle={$contentStyle}
    >
      <AlertContent {...rest} onRequestClose={onRequestClose} />
    </ReanimatedCenterModal>
  );
});

const $modalStyle = { zIndex: 999 };
const $contentStyle: ViewStyle = {
  maxWidth: MAX_CENTER_MODAL_WIDTH - spacing.md * 2,
};

export default AppAlert;
