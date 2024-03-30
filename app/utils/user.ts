import { colors } from "app/theme";
import { User } from "functions/src/types";
import Config from "react-native-config";
import { getColors } from "react-native-image-colors";

export const createUserKeywords = (username: string) => {
  const keywords: string[] = [];

  for (let i = 0; i < username.length; i++) {
    keywords.push(username.substring(0, i + 1).toUpperCase());
  }

  return keywords;
};

export const getAvatarColor = async (avatar: string) => {
  const imageColors = await getColors(avatar, {
    fallback: colors.palette.neutral300,
  });

  console.log(imageColors);

  return imageColors.platform === "android"
    ? imageColors.vibrant
    : imageColors.platform === "ios"
    ? imageColors.background
    : "";
};

export const isUserRegistered = (user: User | null | undefined) => {
  if (!user || !(user.firstName && user.lastName)) {
    return false;
  }
  if (Config.APP === "ADMIN") {
    return !!user.admin;
  } else if (Config.APP === "VENDOR") {
    return !!user.vendor || !!user.driver;
  }
  return !!user.consumer;
};
