import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  generateUid,
  generateVendorLocationKeywords,
  getAppType,
} from "app/utils/general";
import { Positions, Status, VendorLocation } from "delivfree";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TextField } from "../TextField";
import { colors, spacing } from "app/theme";
import { DropDownPicker } from "../DropDownPicker";
import { ModalRef } from "app/utils/types";
import { Text } from "../Text";
import {
  $borderedArea,
  $formLabel,
  $image,
  $imageContainer,
  $input,
  $row,
} from "../styles";
import { useAlert, useOnChange, useUploadImage } from "app/hooks";
import firestore from "@react-native-firebase/firestore";
import FastImage from "react-native-fast-image";
import { chooseImage } from "app/utils/media";
import { AddressSearchModal } from "../AddressSearchModal";
import { Icon } from "../Icon";
import { Button } from "../Button";
import {
  addVendorLocation,
  deleteVendorLocation,
  updateVendorLocation,
} from "app/apis/vendorLocations";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { PhoneNumberInput } from "../PhoneNumberInput";
import PhoneInput from "react-native-phone-number-input";
import { PositionsSelect } from "../Positions/PositionsSelect";
import { fetchPositions } from "app/apis/positions";
import { StatusPicker } from "../StatusPicker";
import { BottomSheet, BottomSheetRef } from "../Modal/BottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "app/redux/store";

interface Props {
  editLocation?: VendorLocation | null;
  vendor: string;
  onClose: () => void;
}

const stateFromProps = (
  editLocation: Props["editLocation"],
  vendor: Props["vendor"]
): VendorLocation =>
  editLocation
    ? {
        ...editLocation,
        positions: editLocation.positions || generateUid(),
      }
    : {
        id: generateUid(),
        address: "",
        latitude: 0,
        longitude: 0,
        geohash: "",
        cuisines: [],
        keywords: [],
        vendor,
        callingCountry: "CA",
        callingCode: "+1",
        phoneNumber: "",
        name: "",
        image: "",
        positions: generateUid(),
        status: "pending",
        updated: Date.now(),
      };

export const ManageVendorLocation = ({
  vendor,
  editLocation,
  onClose,
}: Props) => {
  const addressSearch = useRef<ModalRef>(null);
  const phoneNumberInput = useRef<PhoneInput>(null);

  const Alert = useAlert();

  const cuisines = useAppSelector((state) => state.cuisines.data);

  const { uploadImage, progress, uploadTask } = useUploadImage();

  const [vendorLocationState, setVendorLocationState] =
    useState<VendorLocation>(stateFromProps(editLocation, vendor));
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [positions, setPositions] = useState<Positions>({
    id: vendorLocationState.positions,
    vendorLocation: vendorLocationState.id,
    vendor,
    maxFullTime: 0,
    maxPartTime: 0,
    hasOpenings: false,
    filledFullTime: 0,
    filledPartTime: 0,
    licenses: [],
    status: "pending",
    updated: Date.now(),
    latitude: vendorLocationState.latitude,
    longitude: vendorLocationState.longitude,
    geohash: vendorLocationState.geohash,
  });

  useOnChange(editLocation?.id, (next, prev) => {
    if (next !== prev) {
      setVendorLocationState(stateFromProps(editLocation, vendor));
    }
  });

  const editLocationId = editLocation?.id;

  const getPositionState = useCallback(async () => {
    if (editLocationId) {
      const positions = await fetchPositions({
        vendorLocation: editLocationId,
      });
      console.log(positions);
      if (positions[0]) {
        setPositions(positions[0]);
      }
    }
  }, [editLocationId]);

  useEffect(() => {
    getPositionState();
  }, [getPositionState]);

  const formComplete = useMemo(
    () =>
      vendorLocationState.address &&
      vendorLocationState.latitude &&
      vendorLocationState.longitude &&
      vendorLocationState.geohash &&
      vendorLocationState.cuisines.length &&
      vendorLocationState.phoneNumber &&
      vendorLocationState.name &&
      vendorLocationState.image &&
      (positions.maxPartTime || positions.maxFullTime),
    [vendorLocationState, positions.maxPartTime, positions.maxFullTime]
  );

  const updateStateValue =
    <K extends keyof VendorLocation>(key: K) =>
    (val: VendorLocation[K]) => {
      setVendorLocationState((s) => ({ ...s, [key]: val }));
    };

  const pickImage = async () => {
    const media = await chooseImage();
    if (media?.[0]?.url) {
      setVendorLocationState((s) => ({ ...s, image: media?.[0].url }));
    }
  };

  const pickerItems = useMemo(
    () =>
      cuisines.map((c) => ({
        label: c.name,
        value: c.id,
      })),
    [cuisines]
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
      await deleteVendorLocation(editLocation.id);
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
      if (!positions.maxPartTime && !positions.maxFullTime) {
        return Alert.alert(
          "Missing positions",
          "You must have open positions for this location."
        );
      }
      if (!formComplete) {
        return Alert.alert(
          "Fields imcomplete",
          "Please fill out all fields before continuing."
        );
      }
      setAddLoading(true);
      let imageUrl = editLocation?.image;
      if (!imageUrl || vendorLocationState.image !== imageUrl) {
        imageUrl = await uploadImage(
          vendorLocationState.image,
          `RestuarantLocationImages/${generateUid()}`,
          {
            location: vendorLocationState.id,
            vendor,
          }
        );
      }
      const isAdmin = getAppType() === "ADMIN";
      await addVendorLocation(
        {
          ...vendorLocationState,
          image: imageUrl,
          status: isAdmin ? "approved" : "pending",
          updated: Date.now(),
          keywords: generateVendorLocationKeywords(vendorLocationState),
        },
        {
          ...positions,
          hasOpenings:
            positions.maxFullTime > positions.filledFullTime ||
            positions.maxPartTime > positions.filledPartTime,
          status: isAdmin ? "approved" : "pending",
          geohash: vendorLocationState.geohash,
          latitude: vendorLocationState.latitude,
          longitude: vendorLocationState.longitude,
          updated: Date.now(),
        }
      );

      setAddLoading(false);
      onClose();
    } catch (error) {
      setAddLoading(false);
      console.log("Failed to add location", error);
      Alert.alert("Something went wrong", "Please try again");
    }
  };

  const handleStatusChange = async (status: Status) => {
    try {
      await updateVendorLocation(vendorLocationState.id, { status });
      setVendorLocationState((s) => ({ ...s, status }));
    } catch (error) {
      console.log("Failed to handle status change", error);
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
    <View style={{ flex: 1 }}>
      <View style={$row}>
        <Text preset="subheading" style={{ flex: 1 }}>
          {editLocation ? "Manage Location" : "Add Location"}
        </Text>
        {editLocation && (
          <View style={$row}>
            <Pressable onPress={deleteLocation}>
              <Text style={{ color: colors.textDim }}>Delete</Text>
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

      {getAppType() === "ADMIN" && editLocation && (
        <>
          <Text preset="formLabel" style={[$formLabel, $formLabelTopSpacing]}>
            Status
          </Text>
          <StatusPicker
            status={vendorLocationState.status}
            onPress={handleStatusChange}
          />
        </>
      )}

      <Text preset="formLabel" style={[$formLabel, $formLabelTopSpacing]}>
        Banner image
      </Text>
      {!!vendorLocationState.image && (
        <View style={[$imageContainer, { marginBottom: spacing.sm }]}>
          <FastImage
            source={{ uri: vendorLocationState.image }}
            style={$image}
          />
        </View>
      )}
      <Pressable
        onPress={pickImage}
        style={[$borderedArea, $row, { alignSelf: "flex-start" }]}
      >
        <Icon icon="upload" style={{ marginRight: spacing.xs }} />
        <Text>Upload banner image</Text>
      </Pressable>

      <TextField
        label={"Name"}
        placeholder={"Name"}
        onChangeText={updateStateValue("name")}
        containerStyle={$inputContainer}
        value={vendorLocationState.name}
        onSubmitEditing={() => phoneNumberInput.current?.focus()}
      />
      <PhoneNumberInput
        ref={phoneNumberInput}
        label={"Phone number"}
        placeholder={"Phone number"}
        onChangeText={updateStateValue("phoneNumber")}
        onChangeCallingCode={(callingCode, callingCountry) => {
          setVendorLocationState((s) => ({
            ...s,
            callingCode,
            callingCountry,
          }));
        }}
        containerStyle={$inputContainer}
        value={vendorLocationState.phoneNumber}
        callingCountry={vendorLocationState.callingCountry}
      />
      <Text preset="formLabel" style={[$formLabel, $formLabelTopSpacing]}>
        Cuisines
      </Text>
      <DropDownPicker
        items={pickerItems}
        onSelect={updateStateValue("cuisines")}
        selectedValues={vendorLocationState.cuisines}
        placeholder="Select cuisines"
      />

      <Text preset="formLabel" style={[$formLabel, $formLabelTopSpacing]}>
        Address
      </Text>
      <Pressable
        onPress={() => addressSearch.current?.open()}
        style={[$input, { paddingVertical: spacing.xs }]}
      >
        <Text
          style={
            !vendorLocationState.address ? { color: colors.textDim } : undefined
          }
        >
          {vendorLocationState.address
            ? vendorLocationState.address
            : "Search Address"}
        </Text>
      </Pressable>

      <Text preset="formLabel" style={[$formLabel, $formLabelTopSpacing]}>
        Positions
      </Text>
      <PositionsSelect
        positions={positions}
        onChangeFullTimePositions={(n) =>
          setPositions((p) => ({
            ...p,
            maxFullTime: n,
          }))
        }
        onChangePartTimePositions={(n) =>
          setPositions((p) => ({
            ...p,
            maxPartTime: n,
          }))
        }
      />

      <Button
        preset={formComplete ? "filled" : "default"}
        text={editLocation ? "Edit Location" : "Add Location"}
        style={$button}
        onPress={addLocation}
        RightAccessory={AddLoading}
      />

      <AddressSearchModal
        ref={addressSearch}
        onLocationSelected={(location) => {
          addressSearch.current?.close();
          setVendorLocationState((s) => ({
            ...s,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            geohash: location.geohash,
          }));
        }}
        shortenAddress={false}
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

const ScrollContainer = Platform.select<React.ComponentType<ScrollViewProps>>({
  web: ScrollView,
  default: BottomSheetScrollView as React.ComponentType<ScrollViewProps>,
});

export const ManageVendorLocationModal = forwardRef<
  BottomSheetRef,
  Props & { onDismiss: () => void }
>(function ManageVendorLocationModal({ onDismiss, ...rest }, ref) {
  const insets = useSafeAreaInsets();
  return (
    <BottomSheet ref={ref} onClose={onDismiss}>
      <ScrollContainer
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: spacing.md + insets.bottom,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ManageVendorLocation {...rest} />
      </ScrollContainer>
    </BottomSheet>
  );
});

const $inputContainer: ViewStyle = { marginTop: spacing.sm };
const $button: ViewStyle = { marginTop: spacing.lg };
const $formLabelTopSpacing: TextStyle = { marginTop: spacing.sm };
