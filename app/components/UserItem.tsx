import { BadgeId, User } from "delivfree";
import React from "react";
import { $row } from "./styles";
import { Avatar } from "./Avatar";
import { TextStyle, ViewStyle } from "react-native";
import { spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { Username } from "./Username";
import { TextProps } from "./Text";
import { UserProfileControl } from "./Modal/UserProfileModal";

const defaultTextProps = {};

export const UserItem = ({
  user,
  size = "sm",
  style,
  textProps = defaultTextProps,
  avatarStyle,
  badgeId,
  RightComponent = null,
  enableProfile,
}: {
  user: User | null | undefined;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  style?: ViewStyle;
  textProps?: TextProps;
  avatarStyle?: ViewStyle;
  badgeId?: BadgeId;
  RightComponent?: React.ReactElement | null;
  enableProfile?: boolean;
}) => {
  const avatarSize = sizing[size || textProps?.size] + 12;

  return (
    <UserProfileControl
      user={user}
      style={[$row, style]}
      disabled={!enableProfile}
    >
      <Avatar style={avatarStyle} size={avatarSize} user={user} />
      <Username
        user={user}
        textProps={{
          size,
          preset: "subheading",
          ...textProps,
        }}
        style={$username}
        badgeId={badgeId}
      />
      {RightComponent}
    </UserProfileControl>
  );
};

const $username: TextStyle = { marginStart: spacing.xs, flexShrink: 1 };
