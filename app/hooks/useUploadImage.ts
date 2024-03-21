import { useEffect, useState } from "react";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { storeFile } from "app/services/firebase/storage";

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

  const uploadImage = (
    image: string,
    ref: string,
    metadata?: { [key: string]: string }
  ): Promise<string> => {
    const task = storeFile(ref, image, metadata);

    setUploadTask(task);

    return new Promise((resolve, reject) => {
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
          reject(error);
          setUploadTask(null);
          setProgress(0);
        }
      });
    });
  };

  return { uploadImage, uploadTask, progress };
};
