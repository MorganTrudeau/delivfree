import { Screen } from "app/components";
import { OrdersList } from "app/components/Orders/OrdersList";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { useOrderData, useUploadImage } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { Order } from "delivfree";
import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { ViewOrderModal } from "app/components/Orders/ViewOrder";
import { DriverClockIn } from "app/components/Drivers/DriverClockIn";
import { EmptyList } from "app/components/EmptyList";
import { SubscriptionNotice } from "app/components/Subscription/SubscriptionNotice";
import { selectSubscriptionValid } from "app/redux/selectors";
import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { updateOrder } from "app/apis/orders";

interface DriverOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const DriverOrdersScreen = (props: DriverOrdersScreenProps) => {
  const viewOrderModal = useRef<BottomSheetRef>(null);

  const { uploadImage } = useUploadImage();

  const driver = useAppSelector((state) => state.driver.activeDriver?.id);
  const subscriptionValid = useAppSelector((state) =>
    selectSubscriptionValid(state)
  );

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const clockInStatus = useAppSelector((state) => state.driverClockIn.data);

  console.log(clockInStatus?.vendorLocation);

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

  const takeOrderDropOffPicture = async (order: Order) => {
    try {
      const permissionRes = await requestCameraPermissionsAsync();
      if (!permissionRes.granted) {
        return;
      }
      const res = await launchCameraAsync({ quality: 0.8 });
      if (res.canceled) {
        return;
      }
      const asset = res.assets[0];
      if (asset) {
        const uploadedUri = await uploadImage(
          asset.uri,
          `OrderDropOff/${order.id}`,
          {
            order: order.id,
            vendorLocation: order.vendorLocation,
            vendor: order.vendor,
          }
        );
        await updateOrder(order.id, {
          dropOffPicture: {
            uri: uploadedUri,
            width: asset.width,
            height: asset.height,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderHeader = useCallback(() => <ScreenHeader title={"Orders"} />, []);
  const renderEmpty = useCallback(() => {
    if (!subscriptionValid) {
      return <EmptyList icon={"food"} title={"Find your orders here"} />;
    }
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
  }, [clockInStatus, subscriptionValid]);

  return (
    <>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <SubscriptionNotice style={{ marginBottom: spacing.md }} />
        <OrdersList
          orders={data}
          loadOrders={loadData}
          onOrderPress={onOrderPress}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          onOrderCompleted={takeOrderDropOffPicture}
        />
        <ViewOrderModal
          ref={viewOrderModal}
          onClose={closeCreateOrder}
          order={selectedOrder}
        />
      </Screen>
      {subscriptionValid && <DriverClockIn />}
    </>
  );
};
