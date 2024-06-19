import ImageCropPicker from "react-native-image-crop-picker";
import {
  launchImageLibraryAsync,
  ImagePickerOptions,
  MediaTypeOptions,
  ImagePickerResult,
} from "expo-image-picker";

export type ImagePickerMedia = {
  url: string;
  height: number;
  width: number;
  type: "image" | "video";
};

export const handleImagePickerRes = (
  res: ImagePickerResult,
  type: "image" | "video"
): ImagePickerMedia[] | undefined => {
  if (res.canceled) {
    return;
  }

  if (!res.assets) {
    throw new Error("default_error");
  }

  return res.assets
    .map((asset) => {
      if (asset && asset.uri && asset.width && asset.height) {
        return {
          url: asset.uri,
          width: asset.width,
          height: asset.height,
          type,
        };
      } else {
        return null;
      }
    })
    .filter((asset) => asset !== null) as ImagePickerMedia[];
};

export const chooseImage = async (
  options: Partial<ImagePickerOptions> = {}
): Promise<ImagePickerMedia[] | undefined> => {
  const defaultImagePickerOptions: ImagePickerOptions = {
    selectionLimit: 1,
    allowsMultipleSelection: false,
    quality: 1,
    // allowsEditing: true,
    mediaTypes: MediaTypeOptions.Images,
    ...options,
  };

  const result = await launchImageLibraryAsync(defaultImagePickerOptions);

  return handleImagePickerRes(result, "image");
};

export const cropImage = async (
  pickerType: "camera" | "library",
  options: any = {},
  pickerOptions: Partial<ImagePickerOptions> = {}
) => {
  const cropOptions = {
    width: 360,
    height: 360,
    cropping: true,
    mediaType: "photo" as const,
    ...options,
  };

  try {
    if (pickerType === "library") {
      const media = await chooseImage({ ...pickerOptions, selectionLimit: 1 });

      if (!(media && media.length)) {
        return;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      const res = await ImageCropPicker.openCropper({
        ...cropOptions,
        path: media[0].url,
      });

      if (res.path) {
        return res.path;
      } else {
        throw new Error("missing_path");
      }
    } else {
      const res = await ImageCropPicker.openCamera<{ mediaType: "photo" }>(
        cropOptions
      );
      if (res.path) {
        return res.path;
      } else {
        throw new Error("missing_path");
      }
    }
  } catch (error) {
    // @ts-ignore
    if (error && error.code === "E_PICKER_CANCELLED") {
      return;
    }
    throw error;
  }
};
