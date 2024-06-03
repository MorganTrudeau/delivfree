import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { ModalRef } from "app/components/Modal/CenterModal";
import { OrdersList } from "app/components/Orders/OrdersList";
import { VendorLocationSelect } from "app/components/VendorLocation/VendorLocationSelect";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { useOrderData } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { Order, VendorLocation } from "delivfree";
import React, { useRef, useState } from "react";
import { ViewStyle } from "react-native";

interface DriverOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const DriverOrdersScreen = (props: DriverOrdersScreenProps) => {
  const vendor = useAppSelector(
    (state) => state.vendor.activeVendor?.id as string
  );

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [vendorLocation, setVendorLocation] = useState("");

  const { data, loadData } = useOrderData(vendor, vendorLocation);

  const handleVendorLocationSelect = (location: VendorLocation) =>
    setVendorLocation(location.id);

  const createOrderModal = useRef<ModalRef>(null);

  const onOrderPress = (order: Order) => {
    setSelectedOrder(order);
    createOrderModal.current?.open();
  };
  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
        inDrawer
      >
        <ScreenHeader title={"Orders"} />
        <VendorLocationSelect
          selectedLocationId={vendorLocation}
          onSelect={handleVendorLocationSelect}
          style={$vendorLocationSelect}
        />
        <OrdersList
          orders={data}
          loadOrders={loadData}
          onOrderPress={onOrderPress}
        />
      </Screen>
    </Drawer>
  );
};

const $vendorLocationSelect: ViewStyle = {
  alignSelf: "flex-start",
  marginBottom: spacing.sm,
};
