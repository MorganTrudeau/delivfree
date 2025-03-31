import {
  confirmDelete,
  generateUid,
  localizeCurrency,
  reorder,
  reorderFromIds,
} from "app/utils/general";
import {
  MenuCategory,
  MenuCustomization,
  MenuItem,
  MenuItemAttribute,
} from "delivfree";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { TextField } from "../../TextField";
import {
  $borderedArea,
  $flexRowBetween,
  $formLabel,
  $inputFormContainer,
  $row,
} from "../../styles";
import { Text } from "../../Text";
import { colors, spacing } from "app/theme";
import { Button } from "../../Button";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import {
  deleteMenuItem,
  saveCustomizationOrder,
  saveMenuItem,
} from "app/apis/menus";
import { useAlert, useUploadImage } from "app/hooks";
import { BottomSheet, BottomSheetRef } from "../../Modal/BottomSheet";
import { Icon, IconTypes } from "app/components/Icon";
import { sizing } from "app/theme/sizing";
import { DropDownPicker } from "app/components/DropDownPicker";
import { ImageUpload } from "app/components/ImageUpload";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { DraggableItem } from "app/components/Draggable/DraggableItem";

interface ManageMenuProps {
  vendor: string;
  item?: MenuItem | null | undefined;
  itemCategory?: string | null | undefined;
  categories: MenuCategory[];
  customizations: MenuCustomization[];
  onClose: () => void;
}

const ManageMenuItem = ({
  item,
  itemCategory,
  categories,
  vendor,
  customizations,
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
          vendor,
          categories: itemCategory ? [itemCategory] : [],
          energy: {
            cals: "",
            kj: "",
          },
          attributes: [],
          order: {},
        }
  );

  const [customizationOrder, setCustomizationOrder] = useState<string[]>([]);

  const itemCustomizations = useMemo(() => {
    const filteredCustomizations = [...customizations].filter((c) =>
      c.items.includes(state.id)
    );
    if (customizationOrder.length) {
      return reorderFromIds(filteredCustomizations, customizationOrder);
    } else {
      return reorder(filteredCustomizations, state.id);
    }
  }, [customizations, state.id, customizationOrder]);

  const handleCustomizationsOrderChange = useCallback(
    (params: DragEndParams<MenuCustomization>) => {
      setCustomizationOrder(params.data.map((d) => d.id));
    },
    []
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
    if (!state.image && !localImage) {
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

    const price = (state.price || "0.00").replace(/[^0-9.]/g, "");

    if (!Number(price) && (!item || Number(item.price))) {
      const allowNoPrice = await new Promise((resolve) =>
        Alert.alert(
          "No price added",
          "Do you want this item to have no cost?",
          [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "Confirm", onPress: () => resolve(true) },
          ]
        )
      );
      if (!allowNoPrice) {
        return;
      }
    }

    let image = state.image;

    if (localImage) {
      image = await uploadImage(localImage, `MenuItemPhotos/${state.id}`, {
        vendor,
      });
    }

    if (customizationOrder.length) {
      await saveCustomizationOrder(state.id, customizationOrder);
    }

    await saveMenuItem({
      ...state,
      price,
      image,
    });
    onClose();
  };
  const { exec: onSave, loading } = useAsyncFunction(handleSave);

  const handleDelete = async () => {
    if (!item) {
      return;
    }
    const shouldDelete = await confirmDelete(Alert);
    if (!shouldDelete) {
      return;
    }
    await deleteMenuItem(item.id);
    onClose && onClose();
  };
  const { exec: onDelete, loading: deleteLoading } =
    useAsyncFunction(handleDelete);

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator style={style} color={"#fff"} />
        : undefined,
    [loading]
  );

  const renderCustomization = useCallback(
    ({ item, drag, isActive }: RenderItemParams<MenuCustomization>) => (
      <DraggableItem drag={drag} isActive={isActive} innerStyle={$draggable}>
        <Text>{item.name}</Text>
      </DraggableItem>
    ),
    []
  );

  return (
    <View style={{ padding: spacing.md }}>
      <View style={[$flexRowBetween, { marginBottom: spacing.xs }]}>
        <Text preset="heading">{item ? "Edit item" : "New item"}</Text>
        {!!item && (
          <Pressable onPress={onDelete} style={$row}>
            {deleteLoading && (
              <ActivityIndicator
                color={colors.error}
                style={{ marginRight: spacing.xs }}
              />
            )}
            <Text style={{ color: colors.error }}>Delete</Text>
          </Pressable>
        )}
      </View>

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

      {itemCustomizations.length > 0 && (
        <View style={$inputFormContainer}>
          <Text preset="formLabel" style={$formLabel}>
            Customization order
          </Text>
          <DraggableFlatList
            data={itemCustomizations}
            renderItem={renderCustomization}
            keyExtractor={customizationKeyExtractor}
            activationDistance={1}
            onDragEnd={handleCustomizationsOrderChange}
          />
        </View>
      )}

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
      <Text size={"xs"} style={{ color: active ? colors.white : colors.text }}>
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

const customizationKeyExtractor = (item: MenuCustomization) => item.id;
const $draggable: ViewStyle = { paddingVertical: spacing.sm };
