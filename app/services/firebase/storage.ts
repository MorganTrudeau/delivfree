import storage from "@react-native-firebase/storage";

export const storeFile = (
  refPath: string,
  filePath: string,
  metadata?: {
    [key: string]: string;
  } | null
) => {
  const mediaRef = storage().ref(refPath);
  return mediaRef.putFile(
    filePath,
    metadata ? { customMetadata: metadata } : undefined
  );
};

export const deleteFile = (refPath: string) => {
  return storage().ref(refPath).delete();
};

export const getStorageUrl = (id: string) => {
  return storage().ref(id).getDownloadURL();
};
