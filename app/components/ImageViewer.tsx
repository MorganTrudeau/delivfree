import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, StyleSheet, View } from "react-native";
import FastImage, { ImageStyle, OnLoadEvent } from "react-native-fast-image";
import ReanimatedCenterModal from "./Modal/CenterModal";
import { ModalRef } from "app/utils/types";
import { useDimensions } from "app/hooks/useDimensions";
import { spacing } from "app/theme";
import { Icon } from "./Icon";
import { sizing } from "app/theme/sizing";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Image = ({ image }: { image: string }) => {
  const { width: deviceWidth, height: deviceHeight } = useDimensions();

  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 });

  const source = useMemo(() => ({ uri: image }), [image]);

  const style: ImageStyle = useMemo(
    () => ({
      maxWidth: 1000,
      width: "100%",
      height: "100%",
      maxHeight: 1000,
      alignSelf: "center",
    }),
    [deviceHeight, deviceWidth]
  );

  return <FastImage source={source} style={style} resizeMode="contain" />;
};

export interface ImageViewerRef {
  open: (image: string) => void;
  close: () => void;
}

export const ImageViewer = forwardRef<ImageViewerRef>(function ImageView(
  props,
  ref
) {
  const insets = useSafeAreaInsets();

  const visible = useSharedValue(0);
  const [image, setImage] = useState("");

  const open = (_image: string) => {
    setImage(_image);
    visible.value = withTiming(1);
  };

  const close = () => {
    visible.value = withTiming(0, undefined, (finished) => {
      if (finished) {
        runOnJS(setImage)("");
      }
    });
  };

  useImperativeHandle(ref, () => ({ open, close }));

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: visible.value,
    }),
    [visible]
  );

  return (
    <Portal>
      <Animated.View
        style={[StyleSheet.absoluteFill, animatedStyle]}
        pointerEvents={image ? "auto" : "none"}
      >
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.8)" },
          ]}
          onPress={close}
          disabled={!image}
        />
        {!!image && <Image image={image} />}
        <Pressable
          style={{
            position: "absolute",
            top: insets.top + spacing.md,
            right: spacing.md,
            height: sizing.xxl,
            width: sizing.xxl,
            borderRadius: sizing.xxl / 2,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={close}
        >
          <Icon icon="close" />
        </Pressable>
      </Animated.View>
    </Portal>
  );
});
