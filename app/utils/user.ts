import { colors } from "app/theme";
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
