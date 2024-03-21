import { Platform } from "react-native";
import {
  CameraPermission,
  ImageLibraryPermission,
  usePermissions,
} from "./usePermissions";
import { ImagePickerOptions } from "expo-image-picker";
import { cropImage } from "app/utils/media";

export const useCropImage = () => {
  const Permissions = usePermissions();

  const crop = async (
    pickerType: "camera" | "library",
    options: any = {},
    pickerOptions: Partial<ImagePickerOptions> = {}
  ) => {
    if (Platform.OS === "android") {
      const canUseLibrary = await Permissions.canUse(ImageLibraryPermission);
      if (!canUseLibrary) {
        return;
      }
    }
    if (pickerType === "camera") {
      const canUseCamera = await Permissions.canUse(CameraPermission);
      if (!canUseCamera) {
        return;
      }
    }

    return cropImage(pickerType, options, pickerOptions);
  };

  return { crop };
};
