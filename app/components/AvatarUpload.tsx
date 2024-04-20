import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Keyboard,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { hexColorFromName } from "../utils/general";
import { useAlert, useCropImage, useUploadImage } from "../hooks";
import { ModalRef, User } from "delivfree";
import { colors, spacing } from "app/theme";
import { Icon } from "./Icon";
import { $shadow } from "./styles";
import { Avatar } from "./Avatar";
import DelayedView from "./DelayedView";
import ColorPickerModal from "./Modal/ColorPickerModal";
import OptionsModal, { OptionModalItem } from "./Modal/OptionsModal";
import { sizing } from "app/theme/sizing";
import { getAvatarColor } from "app/utils/user";

export type AvatarUploadRef = {
  openOptions: () => void;
  closeOptions: () => void;
};

type UserUpdate = any; // Partial<Pick<User, "avatar" | "avatarRef" | "color">>;

type Props = {
  user: User;
  onUserChange: (userUpdate: UserUpdate) => void;
  style?: StyleProp<ViewStyle>;
  findColorFromName?: boolean;
  controlled?: boolean;
  hideEditIcon?: boolean;
};

const AvatarUpload = forwardRef<AvatarUploadRef, Props>(function AvatarUpdate(
  {
    user,
    onUserChange,
    style,
    findColorFromName = true,
    controlled,
    hideEditIcon,
  },
  ref
) {
  const { uploadImage, progress, uploadTask } = useUploadImage();
  const { crop } = useCropImage();
  const Alert = useAlert();

  const optionsModal = useRef<ModalRef>(null);
  const colorPickerModal = useRef<ModalRef>(null);

  const openOptions = () => {
    Keyboard.dismiss();
    optionsModal.current?.open();
  };
  const closeOptions = () => optionsModal.current?.close();

  const openColorPicker = () => {
    colorPickerModal.current?.open();
  };

  useImperativeHandle(ref, () => ({
    openOptions,
    closeOptions,
  }));

  const updateUserColor = (color: string) => {
    const updateUpdate = {
      color,
    };
    onUserChange(updateUpdate);
    colorPickerModal.current?.close();
  };

  const pickAvatarImage = async (pickerType: "camera" | "library") => {
    try {
      const image = await crop(
        pickerType,
        { width: 380, height: 380 },
        { quality: 0.8 }
      );

      if (image) {
        const ref = `avatars/${user.id}`;

        const avatar = await uploadImage(image, ref, {
          userId: user.id,
        });

        let color = "";

        try {
          color = await getAvatarColor(avatar);
        } catch (error) {
          console.log("Failed to pick color from image");
        }

        const userUpdate: UserUpdate = {
          avatar,
          avatarRef: ref,
        };

        if (color) {
          userUpdate.color = color;
        }

        onUserChange(userUpdate);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Oops something went wrong", "Try selecting another image.");
    }
  };

  // const removeAvatarImage = () => {
  //   const updatedUser: User = {
  //     ...user,
  //     avatar: "",
  //   };
  //   onUserChange(updatedUser);
  // };

  const getAvatarOptions = () => {
    const options: OptionModalItem[] = [
      {
        text: "Set a color",
        onPress: openColorPicker,
        value: "colors",
        icon: "palette",
      },
      {
        text: "Choose image",
        onPress: () => pickAvatarImage("library"),
        value: "chooseImage",
        icon: "image-plus",
      },
      {
        text: "Take photo",
        onPress: () => pickAvatarImage("camera"),
        value: "takePhoto",
        icon: "camera",
      },
    ];

    // if (user.avatar) {
    //   options.push({
    //     text: "Remove avatar",
    //     onPress: removeAvatarImage,
    //     value: "removeAvatar",
    //     icon: "image-remove",
    //   });
    // }

    return options;
  };

  return (
    <>
      <View style={[$avatarContainer, style]}>
        <TouchableOpacity onPress={openOptions} disabled={controlled}>
          <Avatar user={user} size={120} />
        </TouchableOpacity>
        {!!uploadTask && (
          <AnimatedCircularProgress
            size={136}
            width={8}
            backgroundWidth={8}
            fill={progress}
            tintColor={colors.palette.primary600}
            backgroundColor={colors.palette.primary100}
            style={$loading}
          />
        )}
        {!hideEditIcon && (
          <DelayedView
            style={[$editButton, $shadow]}
            delay={400}
            duration={300}
            pointerEvents="none"
          >
            <Icon
              size={sizing.md}
              color={"#fff"}
              icon={"pencil"}
              onPress={openOptions}
            />
          </DelayedView>
        )}
      </View>

      <OptionsModal ref={optionsModal} options={getAvatarOptions()} />

      <ColorPickerModal
        ref={colorPickerModal}
        currentColor={
          user.firstName
            ? undefined
            : findColorFromName
            ? hexColorFromName(user.firstName)
            : undefined
        }
        onColorChange={updateUserColor}
      />
    </>
  );
});

const $editButton: ViewStyle = {
  position: "absolute",
  bottom: 8,
  right: 8,
  backgroundColor: colors.palette.neutral800,
  borderWidth: 0,
  zIndex: 10,
  padding: spacing.xs,
  borderRadius: 100,
};

const $loading: ViewStyle = { position: "absolute", top: 0, left: 0 };

const $avatarContainer: ViewStyle = { alignSelf: "center", padding: 8 };

export default AvatarUpload;
