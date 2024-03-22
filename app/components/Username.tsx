import React from "react";
import { $row } from "./styles";
import { TextStyle, View, ViewStyle } from "react-native";
import { BadgeId, Size, User } from "delivfree";
import { BadgeIcon } from "./Badges/BadgeIcon";
import { Text, TextProps } from "./Text";
import { useAppSelector } from "app/redux/store";
import { Icon } from "./Icon";
import { sizing } from "app/theme/sizing";
import { colors, spacing } from "app/theme";

const defaultTextProps = {};

export const Username = ({
  user,
  badgeSize,
  badgeId,
  style,
  textProps = defaultTextProps,
}: {
  user: User | null | undefined;
  badgeSize?: Size;
  style?: ViewStyle;
  textProps?: TextProps;
  badgeId?: BadgeId;
}) => {
  const blocked = useAppSelector(
    (state) => !!user?.id && state.user.user?.blocked?.includes(user.id)
  );
  const _badgeId = badgeId || user?.badgeId;

  return (
    <View style={[$row, style]}>
      <Text
        {...textProps}
        style={[$text, textProps.style]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {user?.username}
      </Text>
      {blocked && (
        <Icon
          icon={"cancel"}
          size={sizing.sm}
          style={$blockedIcon}
          color={colors.error}
        />
      )}
      {!blocked && !!_badgeId && (
        <BadgeIcon
          badgeId={_badgeId}
          size={badgeSize || textProps?.size || "sm"}
          style={$badgeIcon}
        />
      )}
    </View>
  );
};

const $text: TextStyle = {};

const $badgeIcon: ViewStyle = {
  marginStart: 3,
};

const $blockedIcon: TextStyle = {
  marginStart: spacing.xxs,
};
