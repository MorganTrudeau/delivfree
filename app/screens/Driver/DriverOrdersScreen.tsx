import { listenToOrders } from "app/apis/orders";
import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { ModalRef } from "app/components/Modal/CenterModal";
import { OrdersList } from "app/components/Orders/OrdersList";
import { RestaurantLocationSelect } from "app/components/RestaurantLocation/RestaurantLocationSelect";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $row, $screen } from "app/components/styles";
import { useDataListener } from "app/hooks/useDataLoading";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { Order, RestaurantLocation } from "delivfree";
import React, { useCallback, useRef, useState } from "react";
import { ViewStyle } from "react-native";

interface DriverOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const DriverOrdersScreen = (props: DriverOrdersScreenProps) => {
  const vendorId = useAppSelector((state) => state.vendor.data?.id as string);

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [restaurantLocationId, setRestaurantLocationId] = useState("");

  const handleLoadOrders = useCallback(
    (limit: number, onData: (orders: Order[]) => void) => {
      if (!(vendorId && restaurantLocationId)) {
        return () => {};
      }
      return listenToOrders(vendorId, restaurantLocationId, limit, onData);
    },
    [vendorId, restaurantLocationId]
  );

  const { data, loadData } = useDataListener<Order>(
    handleLoadOrders,
    restaurantLocationId
  );

  const handleRestaurantLocationSelect = (location: RestaurantLocation) =>
    setRestaurantLocationId(location.id);

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
        <RestaurantLocationSelect
          selectedLocationId={restaurantLocationId}
          onSelect={handleRestaurantLocationSelect}
          style={$restaurantLocationSelect}
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

const $restaurantLocationSelect: ViewStyle = {
  alignSelf: "flex-start",
  marginBottom: spacing.sm,
};
