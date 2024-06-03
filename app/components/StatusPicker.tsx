import { capitalize } from "app/utils/general";
import { Status } from "delivfree";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";
import { PopoverButton } from "./Popover/PopoverButton";
import { PopoverContainer } from "./Popover/PopoverContainer";
import { PopoverListItem } from "./Popover/PopoverListItem";
import { PopoverContext } from "./Popover/PopoverContext";
import { TextInput } from "./TextInput";
import { ButtonSmall } from "./ButtonSmall";
import { StatusIndicator } from "./StatusIndicator";

interface Props {
  status: Status;
  statusLoading?: Status;
  onPress: (status: Status, message: string | null) => void;
  style?: ViewStyle;
}

export const StatusPicker = ({
  status,
  statusLoading,
  onPress,
  style,
}: Props) => {
  const popoverContext = useContext(PopoverContext);

  const handlePress = (_status: Status, _message: string) => {
    popoverContext.dismissPopover();
    onPress(_status, _status === "denied" ? _message : null);
  };

  const renderStatusPopover = useCallback(() => {
    return <Popover status={status} onPress={handlePress} />;
  }, [status]);

  return (
    <PopoverButton renderPopover={renderStatusPopover} style={style}>
      <StatusIndicator status={status} statusLoading={statusLoading} />
    </PopoverButton>
  );
};

const Popover = ({
  status,
  onPress,
}: {
  status: Status;
  onPress: (status: Status, message: string) => void;
}) => {
  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status>(
    status !== "pending" ? status : "approved"
  );

  const handlePress = () => {
    onPress(selectedStatus, message);
  };

  return (
    <PopoverContainer style={{ minWidth: 350 }}>
      <PopoverListItem
        text="Approved"
        onPress={() => setSelectedStatus("approved")}
        checked={selectedStatus === "approved"}
      />
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border,
          marginVertical: spacing.xxxs,
        }}
      />
      <PopoverListItem
        text="Denied"
        onPress={() => setSelectedStatus("denied")}
        checked={selectedStatus === "denied"}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Denied message"
      />
      <ButtonSmall
        text={`Change status to ${selectedStatus}`}
        onPress={handlePress}
        preset="filled"
        style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
      />
    </PopoverContainer>
  );
};

const $statusLabel: ViewStyle = {
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 5,
  alignSelf: "flex-start",
};

const getStatusBorderColor = (status: Status) => {
  switch (status) {
    case "approved":
      return colors.palette.success500;
    case "pending":
      return colors.palette.accent500;
    case "denied":
      return colors.palette.primary600;
  }
};

const getStatusBackgroundColor = (status: Status) => {
  switch (status) {
    case "approved":
      return colors.palette.success100;
    case "pending":
      return colors.palette.accent100;
    case "denied":
      return colors.palette.primary100;
  }
};
