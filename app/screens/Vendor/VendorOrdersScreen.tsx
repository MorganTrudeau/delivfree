import { listenToOrderCount, listenToOrders } from "app/apis/orders";
import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { ModalRef } from "app/components/Modal/CenterModal";
import { OrderCountAlert } from "app/components/OrderCountAlert";
import { CreateOrderModal } from "app/components/Orders/CreateOrder";
import { OrdersList } from "app/components/Orders/OrdersList";
import { RestaurantLocationSelect } from "app/components/RestaurantLocation/RestaurantLocationSelect";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { useAlert } from "app/hooks";
import { useDataListener } from "app/hooks/useDataLoading";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { Order, RestaurantLocation } from "delivfree";
import React, { useCallback, useRef, useState } from "react";
import { ViewStyle } from "react-native";

interface VendorOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const VendorOrdersScreen = (props: VendorOrdersScreenProps) => {
  const Alert = useAlert();

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
  const createOrder = () => {
    if (!restaurantLocationId) {
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
        <CreateOrderModal
          ref={createOrderModal}
          onClose={closeCreateOrder}
          editOrder={selectedOrder}
          onDismiss={onCreateOrderClose}
          restaurantLocationId={restaurantLocationId}
        />
      </Screen>
    </Drawer>
  );
};

const $restaurantLocationSelect: ViewStyle = {
  alignSelf: "flex-start",
  marginBottom: spacing.sm,
};

const $orderCount: ViewStyle = {
  marginBottom: spacing.sm,
};
