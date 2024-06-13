import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { ModalRef } from "app/components/Modal/CenterModal";
import { ManageVendorLocationModal } from "app/components/VendorLocation/ManageVendorLocation";
import { ScreenHeader } from "app/components/ScreenHeader";
import { VendorLocationsList } from "app/components/VendorLocations/VendorLocationsList";
import { $containerPadding, $row, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { VendorLocation } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";

interface VendorLocationsScreenProps extends AppStackScreenProps<"Locations"> {}

export const VendorLocationsScreen = (props: VendorLocationsScreenProps) => {
  const manageLocationModal = useRef<ModalRef>(null);

  const vendorId = useAppSelector((state) => state.vendor.activeVendor?.id);
  const vendorLocations = useAppSelector((state) => state.vendorLocations.data);
  const vendorLocationList = useMemo(
    () => Object.values(vendorLocations),
    [vendorLocations]
  );

  const [editLocation, setEditLocation] = useState<VendorLocation>();

  const createLocation = () => {
    manageLocationModal.current?.open();
  };
  const closeManageLocation = () => {
    manageLocationModal.current?.close();
  };

  const handleEditLocation = useCallback((location: VendorLocation) => {
    setEditLocation(location);
    manageLocationModal.current?.open();
  }, []);

  const onLocationModalClose = () => {
    setEditLocation(undefined);
  };

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
      inDrawer
    >
      <ScreenHeader
        buttonTitle="Add Location"
        onButtonPress={createLocation}
        title="Locations"
      />
      <VendorLocationsList
        locations={vendorLocationList}
        onPress={handleEditLocation}
      />
      {!!vendorId && (
        <ManageVendorLocationModal
          ref={manageLocationModal}
          vendor={vendorId}
          onClose={closeManageLocation}
          onDismiss={onLocationModalClose}
          editLocation={editLocation}
        />
      )}
    </Screen>
  );
};
