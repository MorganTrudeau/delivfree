import React from "react";
import { ActivityIndicator, View, ViewStyle } from "react-native";
import { Status } from "delivfree";
import { colors, spacing } from "app/theme";
import { Text } from "./Text";
import { capitalize } from "app/utils/general";

export const StatusIndicator = ({
  status,
  statusLoading,
  style,
}: {
  status: Status;
  statusLoading?: Status;
  style?: ViewStyle;
}) => {
  const _status = statusLoading || status;

  return (
    <View
      style={[
        $statusLabel,
        {
          borderColor: getStatusBorderColor(_status),
          borderWidth: 2,
          backgroundColor: getStatusBackgroundColor(_status),
        },
        style,
      ]}
    >
      <Text size={"xs"}>{_status ? capitalize(_status) : ""}</Text>
      {!!statusLoading && (
        <ActivityIndicator
          color={getStatusBorderColor(_status)}
          size="small"
          style={$spinner}
        />
      )}
    </View>
  );
};

const $spinner: ViewStyle = { marginLeft: spacing.xxs };
const $statusLabel: ViewStyle = {
  paddingVertical: 2,
  paddingHorizontal: 8,
  borderRadius: 5,
  alignSelf: "flex-start",
  flexDirection: "row",
  alignItems: "center",
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
