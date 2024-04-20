import React from "react";
import { Platform, TextStyle, View, ViewStyle } from "react-native";
import { hexColorFromName } from "../utils/general";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { sizing } from "app/theme/sizing";
import { User } from "delivfree";
import { Text } from "./Text";
import { colors, typography } from "app/theme";
import { $avatar } from "./styles";
import { Icon } from "./Icon";

const defaultSize = sizing.xl;

type Props = {
  user?: User | null;
  size?: number;
  style?: ViewStyle;
  color?: string;
};

export const Avatar = ({ user, size = defaultSize, style, color }: Props) => {
  // const blocked = useAppSelector(
  //   (state) => !!user?.id && state.user.user?.blocked?.includes(user.id)
  // );
  const blocked = false;

  const getBackgroundColor = () => {
    if (!user) {
      return colors.tint;
    }
    return color || hexColorFromName(user.firstName);
  };

  return (
    <View>
      <View
        style={[
          $avatar,
          { backgroundColor: getBackgroundColor() },
          size ? { height: size, width: size, borderRadius: size / 2 } : {},
          style,
        ]}
      >
        {!blocked && !!user?.firstName ? (
          <Text
            allowFontScaling={false}
            style={[
              $text,
              {
                fontSize: size * 0.6,
                lineHeight:
                  size * Platform.select({ android: 0.75, default: 0.75 }),
              },
            ]}
          >
            {user.firstName.charAt(0).toUpperCase()}
          </Text>
        ) : (
          <Icon icon="account" color={"#fff"} size={size * 0.7} />
        )}
      </View>
    </View>
  );
};

type AvatarImageProps = {
  uri: string;
  size: number;
  style?: ViewStyle;
  color: string;
};

const AvatarImage = ({ uri, size, style, color }: AvatarImageProps) => {
  return (
    <FastImage
      source={{ uri }}
      style={[
        $avatar as ImageStyle,
        { backgroundColor: color || colors.palette.neutral300 },
        !!size && { height: size, width: size, borderRadius: size / 2 },
        style as ImageStyle,
      ]}
    />
  );
};

const MemoAvatarImage = React.memo(AvatarImage);

const $text: TextStyle = {
  lineHeight: undefined,
  color: "#fff",
  fontFamily: typography.secondary.bold,
  marginBottom: 2,
};
