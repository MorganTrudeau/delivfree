import { Screen } from "app/components";
import { OrderCountAlert } from "app/components/OrderCountAlert";
import { OrdersList } from "app/components/Orders/OrdersList";
import { VendorLocationSelect } from "app/components/VendorLocation/VendorLocationSelect";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { useOrderData } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { Order, VendorLocation } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ViewStyle } from "react-native";
import { listenToDrivers } from "app/redux/thunks/driver";
import { useReduxListener } from "app/hooks/useReduxListener";
import { ViewOrderModal } from "app/components/Orders/ViewOrder";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";

interface VendorOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const VendorOrdersScreen = (props: VendorOrdersScreenProps) => {
  // const Alert = useAlert();

  const dispatch = useAppDispatch();
  const licenses = useAppSelector((state) => state.vendor.licenses);
  const userType = useAppSelector((state) => state.appConfig.userType);

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

  const { data, loadData } = useOrderData(vendorLocation);

  const handleVendorLocationSelect = useCallback(
    (location: VendorLocation) => setVendorLocation(location.id),
    []
  );

  const viewOrderModal = useRef<BottomSheetRef>(null);

  const onOrderPress = (order: Order) => {
    setSelectedOrder(order);
    viewOrderModal.current?.snapToIndex(0);
  };
  // const createOrder = () => {
  //   if (!vendorLocation) {
  //     return Alert.alert(
  //       "Select a location",
  //       "Please select a restaurant location for your order."
  //     );
  //   }
  //   createOrderModal.current?.open();
  // };
  const closeCreateOrder = () => {
    viewOrderModal.current?.close();
  };
  const onCreateOrderClose = () => {
    setSelectedOrder(undefined);
  };

  const renderHeader = useCallback(
    () => (
      <>
        <ScreenHeader title="Orders" />
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
      {userType === "vendor" && <OrderCountAlert style={$orderCount} />}
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

const $orderCount: ViewStyle = {
  marginBottom: spacing.sm,
};
