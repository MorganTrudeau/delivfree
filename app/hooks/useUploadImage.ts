import { useEffect, useState } from "react";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { storeFile } from "app/services/firebase/storage";
import { Platform } from "react-native";

export const useUploadImage = () => {
  const [uploadTask, setUploadTask] =
    useState<FirebaseStorageTypes.Task | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (uploadTask) {
      uploadTask.on(
        "state_changed",
        (snapshot: FirebaseStorageTypes.TaskSnapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        }
      );
    }
  }, [uploadTask]);

  const uploadImage = async (
    image: string,
    ref: string,
    metadata?: { [key: string]: string }
  ): Promise<string> => {
    let blob: Blob | undefined;

    if (Platform.OS === "web") {
      blob = await fetch(image).then((res) => res.blob());
    }

    const task = storeFile(ref, image, blob, metadata);

    setUploadTask(task);

    return new Promise((resolve, reject) => {
      const handleError = (error: unknown) => {
        reject(error);
        setUploadTask(null);
        setProgress(0);
      };
      task.then(async (snapshot) => {
        try {
          if (
            snapshot.state === "success" &&
            task.snapshot &&
            task.snapshot.ref
          ) {
            const downloadUrl = await task.snapshot.ref.getDownloadURL();

            resolve(downloadUrl);

            setUploadTask(null);
            setProgress(0);
          } else {
            throw new Error("missing_image");
          }
        } catch (error) {
          handleError(error);
        }
      });
      task.catch(handleError);
    });
  };

  return { uploadImage, uploadTask, progress };
};
