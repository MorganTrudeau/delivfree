import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { AddDriverModal } from "app/components/Drivers/AddDriverModal";
import { ModalRef } from "app/components/Modal/CenterModal";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import React, { useRef } from "react";

interface VendorLocationsScreenProps extends AppStackScreenProps<"Drivers"> {}

export const VendorDriversScreen = (props: VendorLocationsScreenProps) => {
  const addDriverModal = useRef<ModalRef>(null);

  const addDriver = () => {
    addDriverModal.current?.open();
  };

  const closeAddDriver = () => {
    addDriverModal.current?.close();
  };

  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <ScreenHeader
          title="Drivers"
          buttonTitle="Add Driver"
          onButtonPress={addDriver}
        />

        <AddDriverModal ref={addDriverModal} onClose={closeAddDriver} />
      </Screen>
    </Drawer>
  );
};
