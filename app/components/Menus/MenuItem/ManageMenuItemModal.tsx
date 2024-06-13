import { generateUid, localizeCurrency } from "app/utils/general";
import { MenuCategory, MenuItem, MenuItemAttribute } from "functions/src/types";
import React, { forwardRef, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { TextField } from "../../TextField";
import {
  $borderedArea,
  $formLabel,
  $inputFormContainer,
  $row,
} from "../../styles";
import { Text } from "../../Text";
import { colors, spacing } from "app/theme";
import { Button } from "../../Button";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { saveMenuItem } from "app/apis/menus";
import { useAlert, useUploadImage } from "app/hooks";
import { BottomSheet, BottomSheetRef } from "../../Modal/BottomSheet";
import { Icon, IconTypes } from "app/components/Icon";
import { sizing } from "app/theme/sizing";
import { DropDownPicker } from "app/components/DropDownPicker";
import { ImageUpload } from "app/components/ImageUpload";
import { AnimatedCircularProgress } from "react-native-circular-progress";

interface ManageMenuProps {
  vendor: string;
  item?: MenuItem | null | undefined;
  itemCategory?: string | null | undefined;
  categories: MenuCategory[];
  onClose: () => void;
}

const ManageMenuItem = ({
  item,
  itemCategory,
  categories,
  vendor,
  onClose,
}: ManageMenuProps) => {
  const Alert = useAlert();

  const { uploadImage, uploadTask, progress } = useUploadImage();

  const categoryDropdownItems = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  const [localImage, setLocalImage] = useState("");
  const [state, setState] = useState<MenuItem>(
    item
      ? { ...item }
      : {
          id: generateUid(),
          image: "",
          name: "",
          description: "",
          price: "",
          vendor: vendor,
          categories: itemCategory ? [itemCategory] : [],
          energy: {
            cals: "",
            kj: "",
          },
          attributes: [],
          order: {},
        }
  );

  const updateState =
    <K extends keyof MenuItem>(key: K) =>
    (val: MenuItem[K]) => {
      setState((s) => ({ ...s, [key]: val }));
    };

  const updateEnergy = (key: "cals" | "kj") => (val: string) => {
    setState((s) => ({ ...s, energy: { ...s.energy, [key]: val } }));
  };

  const updateAttributes = (attribute: MenuItemAttribute) => {
    setState((s) => ({
      ...s,
      attributes: s.attributes.includes(attribute)
        ? s.attributes.filter((a) => a !== attribute)
        : [...s.attributes, attribute],
    }));
  };

  const handleSave = async () => {
    if (!state.image || localImage) {
      if (!state.price) {
        return Alert.alert(
          "Missing photo",
          "Please upload a photo for your item."
        );
      }
    }
    if (!state.name) {
      return Alert.alert("Missing name", "Please enter a name for your item.");
    }
    if (!state.price) {
      return Alert.alert(
        "Missing price",
        "Please enter a price for your item."
      );
    }

    let image = state.image;

    if (localImage) {
      image = await uploadImage(localImage, `MenuItemPhotos/${state.id}`, {
        vendor,
      });
    }

    await saveMenuItem({
      ...state,
      price: state.price.replace(/[^0-9.]/g, ""),
      image,
    });
    onClose();
  };

  const { exec: onSave, loading } = useAsyncFunction(handleSave);

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [loading]
  );

  return (
    <View style={{ padding: spacing.md }}>
      <Text preset="heading" style={{ marginBottom: spacing.xs }}>
        {item ? "Edit item" : "New item"}
      </Text>

      <View style={$inputFormContainer}>
        <Text preset="formLabel" style={$formLabel}>
          Photo
        </Text>
        <ImageUpload
          localImage={localImage}
          uploadedImage={state.image}
          onLocalImagePicked={setLocalImage}
          imageContainerStyle={{ aspectRatio: 1.2 }}
        />
      </View>
      <TextField
        placeholder="Item name"
        label="Item name"
        onChangeText={updateState("name")}
        containerStyle={$inputFormContainer}
        value={state.name}
      />
      <TextField
        placeholder="Description"
        label="Description"
        onChangeText={updateState("description")}
        containerStyle={$inputFormContainer}
        value={state.description}
        multiline
      />
      <TextField
        placeholder="Price"
        label="Price"
        onChangeText={updateState("price")}
        containerStyle={$inputFormContainer}
        value={state.price}
        numberInput
        onFocus={() => {
          if (state.price) {
            updateState("price")(state.price.replace(/[^0-9.]/g, ""));
          }
        }}
        onBlur={() => {
          if (state.price) {
            updateState("price")(localizeCurrency(Number(state.price), "CAD"));
          }
        }}
      />
      <View style={$row}>
        <TextField
          placeholder="Calories"
          label="Calories"
          onChangeText={updateEnergy("cals")}
          containerStyle={[$inputFormContainer, { marginRight: spacing.sm }]}
          value={state.energy.cals}
        />
        <TextField
          placeholder="Item name"
          label="KJ"
          onChangeText={updateEnergy("kj")}
          containerStyle={$inputFormContainer}
          value={state.energy.kj}
        />
      </View>

      <View style={$inputFormContainer}>
        <Text preset="formLabel" style={$formLabel}>
          Attributes
        </Text>
        <View style={$row}>
          <Attribute
            id={"vegetarian"}
            icon={"leaf"}
            text={"Vegetarian"}
            active={state.attributes.includes("vegetarian")}
            onPress={updateAttributes}
          />
          <Attribute
            id={"vegan"}
            icon={"heart"}
            text={"Vegan"}
            active={state.attributes.includes("vegan")}
            onPress={updateAttributes}
          />
          <Attribute
            id={"gluten-free"}
            icon={"barley"}
            text={"Gluten-free"}
            active={state.attributes.includes("gluten-free")}
            onPress={updateAttributes}
          />
        </View>
      </View>

      <View style={$inputFormContainer}>
        <Text preset="formLabel" style={$formLabel}>
          Categories
        </Text>
        <DropDownPicker
          items={categoryDropdownItems}
          onSelect={updateState("categories")}
          selectedValues={state.categories}
        />
      </View>

      <Button
        text={"Save item"}
        preset={state.name ? "filled" : "default"}
        onPress={onSave}
        style={{ marginTop: spacing.md }}
        RightAccessory={Loading}
      />

      {uploadTask && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.3)",
            },
          ]}
        >
          <AnimatedCircularProgress
            size={136}
            width={8}
            backgroundWidth={8}
            fill={progress}
            tintColor={colors.palette.primary600}
            backgroundColor={colors.palette.primary100}
          />
        </View>
      )}
    </View>
  );
};

const Attribute = ({
  icon,
  id,
  text,
  onPress,
  active,
}: {
  icon: IconTypes;
  id: MenuItemAttribute;
  text: string;
  onPress: (id: MenuItemAttribute) => void;
  active: boolean;
}) => {
  return (
    <Pressable
      onPress={() => onPress(id)}
      style={[
        $borderedArea,
        $row,
        { marginRight: spacing.sm },
        active && { backgroundColor: colors.primary },
      ]}
    >
      <Icon
        icon={icon}
        style={{ marginRight: spacing.xxs }}
        color={active ? "#fff" : ""}
        size={sizing.md}
      />
      <Text size={"xs"} style={{ color: active ? "#fff" : colors.text }}>
        {text}
      </Text>
    </Pressable>
  );
};

export const ManageMenuItemModal = forwardRef<
  BottomSheetRef,
  ManageMenuProps & { onDismiss?: () => void }
>(function ManageMenuItemModal({ onDismiss, ...rest }, ref) {
  return (
    <BottomSheet ref={ref} onClose={onDismiss}>
      <ManageMenuItem {...rest} />
    </BottomSheet>
  );
});
