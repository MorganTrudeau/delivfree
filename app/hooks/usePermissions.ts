import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAlert } from "./useAlert";
import {
  PERMISSIONS,
  Permission,
  PermissionStatus,
  RESULTS,
  check,
  request,
} from "react-native-permissions";
import { Linking, Platform } from "react-native";

export const CameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  default: PERMISSIONS.ANDROID.CAMERA,
});

export const ImageLibraryPermission = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  default:
    Number(Platform.Version) >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
});

const storePermissionDenied = async (permission: Permission) => {
  return AsyncStorage.setItem(permission, "TRUE");
};
const getPermissionDenied = async (permission: Permission) => {
  return AsyncStorage.getItem(permission);
};

export const checkPermission = async (
  permission: Permission
): Promise<PermissionStatus | undefined> => {
  try {
    const status = await check(permission);
    return handlePermissionResult(status, permission, true);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const requestPermission = async (
  permission: Permission
): Promise<PermissionStatus> => {
  const status = await request(permission);
  return handlePermissionResult(status, permission, false);
};

const handlePermissionResult = async (
  status: PermissionStatus,
  permission: Permission,
  shouldAskIfPossible: boolean
): Promise<PermissionStatus> => {
  switch (status) {
    case RESULTS.UNAVAILABLE:
      console.log(
        "This feature is not available (on this device / in this context)"
      );
      return status;
    case RESULTS.DENIED:
      if (shouldAskIfPossible) {
        return requestPermission(permission);
      }
      return status;
    case RESULTS.LIMITED:
      console.log("The permission is limited: some actions are possible");
      return status;
    case RESULTS.GRANTED:
      console.log("The permission is granted");
      return status;
    case RESULTS.BLOCKED:
      console.log("The permission is denied and not requestable anymore");
      return status;
  }
};

export const usePermissions = () => {
  const Alert = useAlert();

  const getAlertTitle = (permission: Permission) => {
    switch (permission) {
      case CameraPermission:
        return "Missing camera permission";
      case ImageLibraryPermission:
        return `Missing ${Platform.select({
          android: "storage",
          default: "photo gallery",
        })} permission`;
      default:
        return "Missing permission";
    }
  };

  const getAlertMessage = (permission: Permission) => {
    switch (permission) {
      case CameraPermission:
        return "Missing camera permission";
      case ImageLibraryPermission:
        return `You can enable Frenly ${Platform.select({
          android: "storage",
          default: "photo gallery",
        })} permissions in your phone's settings.`;
      default:
        return "Missing permission";
    }
  };

  const canUse = async (permission: Permission) => {
    const status = await checkPermission(permission);

    switch (status) {
      case RESULTS.DENIED:
        return false;
      case RESULTS.UNAVAILABLE:
        return Alert.alert(
          "Feature unavailable",
          "We could not complete your request as your device does not support this feature."
        );
      case RESULTS.GRANTED:
      case RESULTS.LIMITED:
        return true;
      case RESULTS.BLOCKED:
        try {
          const permissionDenied = await getPermissionDenied(permission);
          if (!permissionDenied) {
            storePermissionDenied(permission);
            return false;
          }
        } catch (error) {
          console.log("Failed to handle stored permission denied", error);
        }

        Alert.alert(getAlertTitle(permission), getAlertMessage(permission), [
          { text: "Later", onPress: () => undefined },
          {
            text: "Enable",
            onPress: () => {
              try {
                Linking.openSettings();
              } catch (error) {
                Alert.alert(
                  "There was a problem",
                  "We could not open your settings. Please navigate to your phone's setting to enable this permission for Frenly"
                );
                console.log("Failed to open settings", error);
              }
            },
          },
        ]);
        return false;
      default:
        return false;
    }
  };

  return { canUse };
};
