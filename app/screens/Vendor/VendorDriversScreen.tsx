import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { AddDriverModal } from "app/components/Drivers/AddDriverModal";
import { DriversList } from "app/components/Drivers/DriversList";
import { ModalRef } from "app/components/Modal/CenterModal";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import React, { useMemo, useRef } from "react";

interface VendorLocationsScreenProps extends AppStackScreenProps<"Drivers"> {}

export const VendorDriversScreen = (props: VendorLocationsScreenProps) => {
  const addDriverModal = useRef<ModalRef>(null);

  const drivers = useAppSelector((state) => state.vendorDrivers.data);
  const driversList = useMemo(() => Object.values(drivers), [drivers]);

  const addDriver = () => {
    addDriverModal.current?.open();
  };

  const closeAddDriver = () => {
    addDriverModal.current?.close();
  };

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
      inDrawer
    >
      <ScreenHeader
        title="Drivers"
        buttonTitle="Add Driver"
        onButtonPress={addDriver}
      />
      <DriversList drivers={driversList} />
      <AddDriverModal ref={addDriverModal} onClose={closeAddDriver} />
    </Screen>
  );
};
