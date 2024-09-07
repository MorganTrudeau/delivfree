import React, { useState } from "react";
import { ActivityIndicator, Pressable, View, ViewStyle } from "react-native";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { $borderedArea, $row } from "./styles";
import { getDocumentAsync, DocumentPickerAsset } from "expo-document-picker";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { useUploadImage } from "app/hooks";

type Props = {
  onFileUploaded: (uri: string) => void;
  label: string;
  style?: ViewStyle;
  fileDest: string;
  fileMetadata?: { [key: string]: string };
};

export const FileUpload = ({
  onFileUploaded,
  label,
  style,
  fileDest,
  fileMetadata,
}: Props) => {
  const [file, setFile] = useState<DocumentPickerAsset | null>(null);

  const { uploadImage, uploadTask } = useUploadImage();

  const pickFile = async () => {
    const res = await getDocumentAsync();
    if (!res.canceled && res.assets[0]) {
      setFile(res.assets[0]);
      const uploadUri = await uploadImage(
        res.assets[0].uri,
        fileDest,
        fileMetadata
      );
      onFileUploaded(uploadUri);
    }
  };

  return (
    <Pressable
      style={[$row, $borderedArea, { alignSelf: "flex-start" }, style]}
      onPress={pickFile}
    >
      <View
        style={{
          width: sizing.xl,
          height: sizing.xl,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        {uploadTask ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Icon
            icon={file ? "file-check-outline" : "file-upload-outline"}
            size={sizing.xl}
          />
        )}
      </View>
      <Text style={{ marginLeft: spacing.sm }}>{label}</Text>
    </Pressable>
  );
};
