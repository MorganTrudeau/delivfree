import React, { forwardRef, useMemo, useRef, useState } from "react";
import { generateUid } from "app/utils/general";
import { Cuisines, RestaurantLocation } from "delivfree";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { TextField } from "../TextField";
import { colors, spacing } from "app/theme";
import { DropDownPicker } from "../DropDownPicker";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import { getCuisineTitle } from "app/utils/cuisines";
import { Text } from "../Text";
import {
  $borderedArea,
  $image,
  $imageContainer,
  $input,
  $row,
} from "../styles";
import { useAlert, useUploadImage } from "app/hooks";
import firestore from "@react-native-firebase/firestore";
import FastImage from "react-native-fast-image";
import { chooseImage, cropImage } from "app/utils/media";
import { AddressSearchModal } from "../AddressSearchModal";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { addRestaurantLocation } from "app/apis/restaurants";
import { AnimatedCircularProgress } from "react-native-circular-progress";

interface Props {
  editLocation?: RestaurantLocation | null;
  vendor: string;
  onClose: () => void;
}

export const ManageRestaurantLocation = ({
  vendor,
  editLocation,
  onClose,
}: Props) => {
  const addressSearch = useRef<ModalRef>(null);

  const Alert = useAlert();

  const { uploadImage, progress, uploadTask } = useUploadImage();

  const [locationState, setLocationState] = useState<RestaurantLocation>(
    editLocation
      ? { ...editLocation }
      : {
          id: generateUid(),
          address: "",
          latitude: 0,
          longitude: 0,
          geohash: "",
          cuisines: [],
          keywords: [],
          vendor,
          phoneNumber: "",
          name: "",
          menuLink: "",
          orderLink: "",
          image: "",
        }
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const formComplete = useMemo(
    () =>
      locationState.address &&
      locationState.latitude &&
      locationState.longitude &&
      locationState.geohash &&
      locationState.cuisines.length &&
      (locationState.phoneNumber ||
        locationState.menuLink ||
        locationState.orderLink) &&
      locationState.name &&
      locationState.image,
    [locationState]
  );

  const updateStateValue =
    <K extends keyof RestaurantLocation>(key: K) =>
    (val: RestaurantLocation[K]) => {
      setLocationState((s) => ({ ...s, [key]: val }));
    };

  const pickImage = async () => {
    const media = await chooseImage();
    if (media?.[0]?.url) {
      setLocationState((s) => ({ ...s, image: media?.[0].url }));
    }
  };

  const pickerItems = useMemo(
    () =>
      Object.values(Cuisines).map((c) => ({
        label: getCuisineTitle(c),
        value: c,
      })),
    []
  );

  const deleteLocation = async () => {
    try {
      if (!editLocation) {
        return;
      }
      const shouldContinue = await new Promise((resolve) => {
        Alert.alert(
          "Delete Location",
          "Are you sure you want to delete this location?",
          [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "Delete", onPress: () => resolve(true) },
          ]
        );
      });
      if (!shouldContinue) {
        return;
      }
      setDeleteLoading(true);
      await firestore()
        .collection("RestaurantLocations")
        .doc(editLocation.id)
        .delete();
      setDeleteLoading(false);
      onClose();
    } catch (error) {
      setDeleteLoading(false);
      console.log("Delete order order", error);
      Alert.alert("Something went wrong", "Please try again");
    }
  };

  const addLocation = async () => {
    try {
      if (!formComplete) {
        return Alert.alert(
          "Fields imcomplete",
          "Please fill out all fields before continuing."
        );
      }
      setAddLoading(true);
      const imageUrl = await uploadImage(
        locationState.image,
        `RestuarantLocationImages/${generateUid()}`,
        {
          location: locationState.id,
          vendor,
        }
      );
      await addRestaurantLocation({ ...locationState, image: imageUrl });
      setAddLoading(false);
      onClose();
    } catch (error) {
      setAddLoading(false);
      console.log("Failed to add location", error);
      Alert.alert("Something went wrong", "Please try again");
    }
  };

  const AddLoading = useMemo(
    () =>
      addLoading
        ? ({ style }) => <ActivityIndicator color={"#fff"} style={style} />
        : undefined,
    [addLoading]
  );

  return (
    <View>
      <View style={$row}>
        <Text preset="subheading" style={{ flex: 1 }}>
          {editLocation ? "Manage Location" : "Add Location"}
        </Text>
        {editLocation && (
          <View style={$row}>
            <Pressable onPress={deleteLocation}>
              <Text style={{ color: colors.error }}>Delete</Text>
            </Pressable>
            {deleteLoading && (
              <ActivityIndicator
                color={colors.error}
                style={{ marginLeft: spacing.xs }}
              />
            )}
          </View>
        )}
      </View>
      <TextField
        label={"Name"}
        placeholder={"Name"}
        onChangeText={updateStateValue("name")}
        containerStyle={$inputContainer}
        value={locationState.name}
      />
      <TextField
        label={"Phone number"}
        placeholder={"Phone number"}
        onChangeText={updateStateValue("phoneNumber")}
        containerStyle={$inputContainer}
        value={locationState.phoneNumber}
      />
      <Text
        preset="formLabel"
        style={{ marginBottom: spacing.xs, marginTop: spacing.sm }}
      >
        Cuisines
      </Text>
      <DropDownPicker
        items={pickerItems}
        onSelect={updateStateValue("cuisines")}
        selectedValues={locationState.cuisines}
        placeholder="Select cuisines"
      />
      <TextField
        label={"Menu link"}
        placeholder={"Menu link"}
        onChangeText={updateStateValue("menuLink")}
        containerStyle={$inputContainer}
        value={locationState.menuLink}
      />
      <TextField
        label={"Online order link"}
        placeholder={"Online order link"}
        onChangeText={updateStateValue("orderLink")}
        containerStyle={$inputContainer}
        value={locationState.orderLink}
      />
      <Text
        preset="formLabel"
        style={{ marginBottom: spacing.xs, marginTop: spacing.sm }}
      >
        Address
      </Text>
      <Pressable onPress={() => addressSearch.current?.open()} style={$input}>
        <Text
          style={!locationState.address ? { color: colors.textDim } : undefined}
        >
          {locationState.address ? locationState.address : "Search Address"}
        </Text>
      </Pressable>
      <AddressSearchModal
        ref={addressSearch}
        onLocationSelected={(location) => {
          addressSearch.current?.close();
          setLocationState((s) => ({
            ...s,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            geohash: location.geohash,
          }));
        }}
        shortenAddress={false}
      />
      <Text
        preset="formLabel"
        style={{ marginBottom: spacing.xs, marginTop: spacing.sm }}
      >
        Banner image
      </Text>
      {!!locationState.image && (
        <View style={[$imageContainer, { marginBottom: spacing.sm }]}>
          <FastImage source={{ uri: locationState.image }} style={$image} />
        </View>
      )}
      <Pressable
        onPress={pickImage}
        style={[$borderedArea, $row, { alignSelf: "flex-start" }]}
      >
        <Icon icon="upload" style={{ marginRight: spacing.xs }} />
        <Text>Upload banner image</Text>
      </Pressable>
      <Button
        preset={formComplete ? "filled" : "default"}
        text={editLocation ? "Edit Location" : "Add Location"}
        style={$button}
        onPress={addLocation}
        RightAccessory={AddLoading}
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

export const ManageRestaurantLocationModal = forwardRef<
  ModalRef,
  Props & { onDismiss: () => void }
>(function ManageRestaurantLocationModal({ onDismiss, ...rest }, ref) {
  return (
    <ReanimatedCenterModal ref={ref} onDismiss={onDismiss}>
      <View style={{ padding: spacing.md }}>
        <ManageRestaurantLocation {...rest} />
      </View>
    </ReanimatedCenterModal>
  );
});

const $inputContainer: ViewStyle = { marginTop: spacing.sm };
const $button: ViewStyle = { marginTop: spacing.lg };
