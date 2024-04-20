import storage from "@react-native-firebase/storage";
import { Platform } from "react-native";

export const storeFile = (
  refPath: string,
  filePath: string,
  blob: Blob | undefined,
  metadata?: {
    [key: string]: string;
  } | null
) => {
  const mediaRef = storage().ref(refPath);
  if (Platform.OS === "web" && blob) {
    return mediaRef.put(
      blob,
      metadata ? { customMetadata: metadata } : undefined
    );
  } else {
    return mediaRef.putFile(
      filePath,
      metadata ? { customMetadata: metadata } : undefined
    );
  }
};

export const deleteFile = (refPath: string) => {
  return storage().ref(refPath).delete();
};

export const getStorageUrl = (id: string) => {
  return storage().ref(id).getDownloadURL();
};
