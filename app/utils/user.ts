import { colors } from "app/theme";
import { Driver, User, Vendor } from "delivfree";
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
  if (Config.REACT_NATIVE_APP === "ADMIN") {
    return !!user.admin;
  } else if (Config.REACT_NATIVE_APP === "VENDOR") {
    return !!user.vendor?.ids || !!user.driver?.id;
  }
  return !!user.consumer;
};
