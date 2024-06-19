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
import React, { useCallback, useRef, useState } from "react";
import { ViewStyle } from "react-native";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { ViewOrderModal } from "app/components/Orders/ViewOrder";

interface DriverOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const DriverOrdersScreen = (props: DriverOrdersScreenProps) => {
  const viewOrderModal = useRef<BottomSheetRef>(null);

  const driver = useAppSelector((state) => state.driver.activeDriver?.id);

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [vendorLocation, setVendorLocation] = useState("");

  const { data, loadData } = useOrderData({ vendorLocation, driver });

  const handleVendorLocationSelect = (location: VendorLocation) =>
    setVendorLocation(location.id);

  const onOrderPress = (order: Order) => {
    setSelectedOrder(order);
    viewOrderModal.current?.snapToIndex(0);
  };
  const closeCreateOrder = () => {
    viewOrderModal.current?.close();
  };

  const renderHeader = useCallback(
    () => (
      <>
        <ScreenHeader title={"Orders"} />
        <VendorLocationSelect
          selectedLocationId={vendorLocation}
          onSelect={handleVendorLocationSelect}
          style={$vendorLocationSelect}
        />
      </>
    ),
    [vendorLocation, handleVendorLocationSelect]
  );

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <OrdersList
        orders={data}
        loadOrders={loadData}
        onOrderPress={onOrderPress}
        ListHeaderComponent={renderHeader}
      />
      <ViewOrderModal
        ref={viewOrderModal}
        onClose={closeCreateOrder}
        order={selectedOrder}
      />
    </Screen>
  );
};

const $vendorLocationSelect: ViewStyle = {
  alignSelf: "flex-start",
  marginBottom: spacing.sm,
};
