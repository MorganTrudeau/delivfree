import { colors, spacing } from "app/theme";
import { chooseImage } from "app/utils/media";
import React from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { $borderedArea, $image, $imageContainer, $row } from "./styles";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { Icon } from "./Icon";
import { Text } from "./Text";

type Props = {
  uploadedImage: string | null | undefined;
  localImage: string | null | undefined;
  onLocalImagePicked: (image: string) => void;
  uploadButtonText?: string;
  buttonHelpText?: string;
  style?: ViewStyle;
  imageContainerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
};

export const ImageUpload = ({
  uploadedImage,
  localImage,
  onLocalImagePicked,
  uploadButtonText = "Upload image",
  buttonHelpText,
  style,
  imageContainerStyle,
  imageStyle,
}: Props) => {
  const pickImage = async () => {
    const media = await chooseImage();
    if (media?.[0]?.url) {
      onLocalImagePicked(media?.[0].url);
    }
  };

  const uri = localImage || uploadedImage;

  return (
    <View style={style}>
      {!!uri && (
        <View
          style={[
            $imageContainer,
            { marginBottom: spacing.sm },
            imageContainerStyle,
          ]}
        >
          <FastImage source={{ uri }} style={[$image, imageStyle]} />
        </View>
      )}

      <Pressable
        onPress={pickImage}
        style={[$borderedArea, $row, { alignSelf: "flex-start" }]}
      >
        <Icon icon="upload" style={{ marginRight: spacing.xs }} />
        <Text>{uploadButtonText}</Text>
      </Pressable>

      {!!buttonHelpText && (
        <Text
          style={{ color: colors.textDim, marginTop: spacing.xxs }}
          size={"xs"}
        >
          {buttonHelpText}
        </Text>
      )}
    </View>
  );
};
