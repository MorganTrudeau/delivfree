import { listenToOrders } from "app/apis/orders";
import { Icon, Screen, Text } from "app/components";
import { ButtonSmall } from "app/components/ButtonSmall";
import { Drawer } from "app/components/Drawer";
import { ModalRef } from "app/components/Modal/CenterModal";
import { CreateOrderModal } from "app/components/Orders/CreateOrder";
import { OrdersList } from "app/components/Orders/OrdersList";
import { RestaurantLocationSelect } from "app/components/RestaurantLocation/RestaurantLocationSelect";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $row, $screen } from "app/components/styles";
import { useAlert } from "app/hooks";
import { useDataListener } from "app/hooks/useDataLoading";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { Order, RestaurantLocation } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, ViewStyle } from "react-native";

interface VendorOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const VendorOrdersScreen = (props: VendorOrdersScreenProps) => {
  const Alert = useAlert();

  const vendorId = useAppSelector((state) => state.vendor.data?.id as string);

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [restaurantLocationId, setRestaurantLocationId] = useState("");

  console.log({ vendorId, restaurantLocationId });

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
        <ScreenHeader
          buttonTitle="Create Order"
          onButtonPress={createOrder}
          title="Orders"
        />
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
