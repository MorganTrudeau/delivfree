import { Screen } from "app/components";
import { OrdersList } from "app/components/Orders/OrdersList";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { useOrderData } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { Order } from "delivfree";
import React, { useCallback, useRef, useState } from "react";
import { View, ViewStyle } from "react-native";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { ViewOrderModal } from "app/components/Orders/ViewOrder";
import { DriverClockIn } from "app/components/Drivers/DriverClockIn";
import { EmptyList } from "app/components/EmptyList";

interface DriverOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const DriverOrdersScreen = (props: DriverOrdersScreenProps) => {
  const viewOrderModal = useRef<BottomSheetRef>(null);

  const driver = useAppSelector((state) => state.driver.activeDriver?.id);

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const clockInStatus = useAppSelector((state) => state.driverClockIn.data);

  const { data, loadData } = useOrderData({
    vendorLocation: clockInStatus?.vendorLocation,
    driver,
  });

  const onOrderPress = (order: Order) => {
    setSelectedOrder(order);
    viewOrderModal.current?.snapToIndex(0);
  };
  const closeCreateOrder = () => {
    viewOrderModal.current?.close();
  };

  const renderHeader = useCallback(() => <ScreenHeader title={"Orders"} />, []);
  const renderEmpty = useCallback(() => {
    return (
      <View style={{ padding: spacing.md }}>
        {!clockInStatus ? (
          <EmptyList
            icon={"timer-outline"}
            title={"Clock in to accept orders"}
          />
        ) : (
          <EmptyList title={"No orders at this location"} />
        )}
      </View>
    );
  }, [clockInStatus]);

  return (
    <>
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
          ListEmptyComponent={renderEmpty}
        />
        <ViewOrderModal
          ref={viewOrderModal}
          onClose={closeCreateOrder}
          order={selectedOrder}
        />
      </Screen>
      <DriverClockIn />
    </>
  );
};

const $vendorLocationSelect: ViewStyle = {
  alignSelf: "flex-start",
  marginBottom: spacing.sm,
};
