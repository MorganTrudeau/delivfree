import { listenToOrderCount, listenToOrders } from "app/apis/orders";
import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { ModalRef } from "app/components/Modal/CenterModal";
import { OrderCountAlert } from "app/components/OrderCountAlert";
import { CreateOrderModal } from "app/components/Orders/CreateOrder";
import { OrdersList } from "app/components/Orders/OrdersList";
import { VendorLocationSelect } from "app/components/VendorLocation/VendorLocationSelect";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { useAlert, useOrderData } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { Order, VendorLocation } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ViewStyle } from "react-native";
import driver from "app/redux/reducers/driver";
import { listenToDrivers } from "app/redux/thunks/driver";
import { useReduxListener } from "app/hooks/useReduxListener";

interface VendorOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const VendorOrdersScreen = (props: VendorOrdersScreenProps) => {
  const Alert = useAlert();

  const dispatch = useAppDispatch();
  const vendor = useAppSelector(
    (state) => state.vendor.activeVendor?.id as string
  );
  const licenses = useAppSelector((state) => state.vendor.licenses);

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [vendorLocation, setVendorLocation] = useState("");

  const vendorDrivers = useMemo(
    () => Object.values(licenses).map((l) => l.driver),
    [licenses]
  );

  const driverListener = useCallback(() => {
    return dispatch(listenToDrivers({ id: vendorDrivers }));
  }, [vendorDrivers]);
  useReduxListener(driverListener);

  const { data, loadData } = useOrderData(vendor, vendorLocation);

  const handleVendorLocationSelect = (location: VendorLocation) =>
    setVendorLocation(location.id);

  const createOrderModal = useRef<ModalRef>(null);

  const onOrderPress = (order: Order) => {
    setSelectedOrder(order);
    createOrderModal.current?.open();
  };
  const createOrder = () => {
    if (!vendorLocation) {
      return Alert.alert(
        "Select a location",
        "Please select a restaurant location for your order."
      );
    }
    createOrderModal.current?.open();
  };
  const closeCreateOrder = () => {
    createOrderModal.current?.close();
  };
  const onCreateOrderClose = () => {
    setSelectedOrder(undefined);
  };
  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
        inDrawer
      >
        <ScreenHeader
          buttonTitle="Create Order"
          onButtonPress={createOrder}
          title="Orders"
        />
        <OrderCountAlert style={$orderCount} />
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
        <CreateOrderModal
          ref={createOrderModal}
          onClose={closeCreateOrder}
          editOrder={selectedOrder}
          onDismiss={onCreateOrderClose}
          vendorLocationId={vendorLocation}
        />
      </Screen>
    </Drawer>
  );
};

const $vendorLocationSelect: ViewStyle = {
  alignSelf: "flex-start",
  marginBottom: spacing.sm,
};

const $orderCount: ViewStyle = {
  marginBottom: spacing.sm,
};
