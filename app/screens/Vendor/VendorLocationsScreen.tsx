import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { ModalRef } from "app/components/Modal/CenterModal";
import { ManageVendorLocationModal } from "app/components/VendorLocation/ManageVendorLocation";
import { ScreenHeader } from "app/components/ScreenHeader";
import { VendorLocationsList } from "app/components/VendorLocations/VendorLocationsList";
import {
  $containerPadding,
  $row,
  $screen,
  isLargeScreen,
} from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { VendorLocation } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDimensions } from "app/hooks/useDimensions";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "app/theme";

interface VendorLocationsScreenProps extends AppStackScreenProps<"Locations"> {}

export const VendorLocationsScreen = (props: VendorLocationsScreenProps) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);
  const insets = useSafeAreaInsets();

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: spacing.md + insets.bottom,
      flexGrow: 1,
    }),
    [insets.bottom]
  );

  const manageLocationModal = useRef<BottomSheetRef>(null);

  const vendorId = useAppSelector((state) => state.vendor.activeVendor?.id);
  const vendorLocations = useAppSelector((state) => state.vendorLocations.data);
  const vendorLocationList = useMemo(
    () => Object.values(vendorLocations),
    [vendorLocations]
  );

  const [editLocation, setEditLocation] = useState<VendorLocation>();

  const createLocation = () => {
    setEditLocation(undefined);
    manageLocationModal.current?.snapToIndex(0);
  };
  const closeManageLocation = () => {
    manageLocationModal.current?.close();
  };
  const handleVendorLocationClosed = useCallback(() => {
    setEditLocation(undefined);
  }, []);

  const handleEditLocation = useCallback((location: VendorLocation) => {
    setEditLocation(location);
    manageLocationModal.current?.snapToIndex(0);
  }, []);

  const renderHeader = useCallback(
    () => (
      <ScreenHeader
        buttonTitle={largeScreen ? "Add Location" : "New"}
        onButtonPress={createLocation}
        title="Locations"
      />
    ),
    [largeScreen]
  );

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <VendorLocationsList
        locations={vendorLocationList}
        onPress={handleEditLocation}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={renderHeader}
      />
      {!!vendorId && (
        <ManageVendorLocationModal
          ref={manageLocationModal}
          vendor={vendorId}
          onClose={closeManageLocation}
          editLocation={editLocation}
          onDismiss={handleVendorLocationClosed}
        />
      )}
    </Screen>
  );
};
