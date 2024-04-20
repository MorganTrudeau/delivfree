import { Icon, Screen, Text } from "app/components";
import { ButtonSmall } from "app/components/ButtonSmall";
import { Drawer } from "app/components/Drawer";
import { ModalRef } from "app/components/Modal/CenterModal";
import { ManageRestaurantLocationModal } from "app/components/RestaurantLocation/ManageRestaurantLocation";
import RestaurantsList from "app/components/RestaurantsList";
import { $containerPadding, $row, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { RestaurantLocation } from "delivfree";
import React, { useMemo, useRef, useState } from "react";
import { View, ViewStyle } from "react-native";

interface VendorLocationsScreenProps extends AppStackScreenProps<"Locations"> {}

export const VendorLocationsScreen = (props: VendorLocationsScreenProps) => {
  const manageLocationModal = useRef<ModalRef>(null);

  const vendorId = useAppSelector((state) => state.vendor.data?.id);
  const restaurantLocations = useAppSelector(
    (state) => state.restaurantLocations.data
  );
  const restaurantLocationList = useMemo(
    () => Object.values(restaurantLocations),
    [restaurantLocations]
  );

  const [editLocation, setEditLocation] = useState<RestaurantLocation>();

  const createLocation = () => {
    manageLocationModal.current?.open();
  };
  const closeManageLocation = () => {
    manageLocationModal.current?.close();
  };

  const handleEditLocation = (location: RestaurantLocation) => {
    setEditLocation(location);
    manageLocationModal.current?.open();
  };

  const onLocationModalClose = () => {
    setEditLocation(undefined);
  };

  const PlusIcon = useMemo(
    () =>
      ({ style }) =>
        <Icon icon="plus" color={"#fff"} style={style} />,
    []
  );

  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <View style={[$row, { justifyContent: "space-between" }]}>
          <Text preset="heading">Locations</Text>
          <ButtonSmall
            LeftAccessory={PlusIcon}
            text={"Add Location"}
            preset="filled"
            onPress={createLocation}
          />
        </View>
        <RestaurantsList
          restaurants={restaurantLocationList}
          style={$list}
          contentContainerStyle={$listContent}
          onPress={handleEditLocation}
        />
        {!!vendorId && (
          <ManageRestaurantLocationModal
            ref={manageLocationModal}
            vendor={vendorId}
            onClose={closeManageLocation}
            onDismiss={onLocationModalClose}
            editLocation={editLocation}
          />
        )}
      </Screen>
    </Drawer>
  );
};

const $list: ViewStyle = { marginHorizontal: -spacing.md };
const $listContent: ViewStyle = {
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md * 2,
};
