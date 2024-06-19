import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { $borderedArea, $formLabel } from "./styles";
import { Icon } from "./Icon";
import { Text, TextProps } from "./Text";
import { useAlert, useUploadImage } from "app/hooks";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { chooseImage } from "app/utils/media";
import { ImageViewer, ImageViewerRef } from "./ImageViewer";

export const DriversLicenseUpload = ({
  frontImage,
  backImage,
  onFrontImageUploaded,
  onBackImageUploaded,
  style,
  driverId,
  viewOnly,
  titleProps,
}: {
  frontImage: string | null | undefined;
  backImage: string | null | undefined;
  onFrontImageUploaded?: (image: string) => void;
  onBackImageUploaded?: (image: string) => void;
  style?: ViewStyle;
  driverId: string;
  viewOnly?: boolean;
  titleProps?: TextProps;
}) => {
  const Alert = useAlert();
  const { uploadImage, uploadTask, progress } = useUploadImage();

  const imageViewer = useRef<ImageViewerRef>(null);

  const [front, setFront] = useState(frontImage);
  const [back, setBack] = useState(backImage);

  const uploadSide = async (side: "front" | "back") => {
    try {
      const media = await chooseImage();
      if (media === undefined) {
        return;
      }
      const url = media[0]?.url;
      if (!url) {
        throw "missing-image";
      }
      side === "front" ? setFront(url) : setBack(url);
      const firebaseUrl = await uploadImage(
        url,
        `DriversLicenses/${driverId}/drivers-license-${side}`
      );
      side === "front"
        ? onFrontImageUploaded && onFrontImageUploaded(firebaseUrl)
        : onBackImageUploaded && onBackImageUploaded(firebaseUrl);
    } catch (e) {
      console.log("Failed to upload image", e);
      Alert.alert("Upload failed", "Please try another image.");
    }
  };

  const handlePress = (side: "front" | "back") => () => {
    if (viewOnly) {
      if (side === "front" && front) {
        imageViewer.current?.open(front);
      } else if (side === "back" && back) {
        imageViewer.current?.open(back);
      }
    } else {
      uploadSide(side);
    }
  };

  return (
    <View style={style}>
      <Text preset="formLabel" style={$formLabel} {...titleProps}>
        Driver's license
      </Text>
      <View style={$container}>
        <Pressable style={$imageContainer} onPress={handlePress("front")}>
          {front ? (
            <FastImage source={{ uri: front }} style={$placeholder} />
          ) : (
            <View style={$placeholder}>
              <Icon icon="image-plus" color={colors.primary} />
              <Text selectable={false}>Front</Text>
            </View>
          )}
        </Pressable>

        <Pressable style={$imageContainer} onPress={handlePress("back")}>
          {back ? (
            <FastImage source={{ uri: back }} style={$placeholder} />
          ) : (
            <View style={$placeholder}>
              <Icon icon="image-plus" color={colors.primary} />
              <Text selectable={false}>Back</Text>
            </View>
          )}
        </Pressable>

        {uploadTask && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.3)",
              },
            ]}
          >
            <AnimatedCircularProgress
              size={40}
              width={8}
              backgroundWidth={8}
              fill={progress}
              tintColor={colors.palette.primary600}
              backgroundColor={colors.palette.primary100}
            />
          </View>
        )}
      </View>

      <ImageViewer ref={imageViewer} />
    </View>
  );
};

const $container: ViewStyle = {
  ...$borderedArea,
  flexDirection: "row",
  maxWidth: 400,
  columnGap: spacing.xs,
};
const $imageContainer: ViewStyle = {
  borderRadius: borderRadius.md,
  overflow: "hidden",
  flex: 0.5,
  aspectRatio: 2,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.borderLight,
};
const $placeholder: ImageStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: colors.palette.shade100,
  alignItems: "center",
  justifyContent: "center",
};
