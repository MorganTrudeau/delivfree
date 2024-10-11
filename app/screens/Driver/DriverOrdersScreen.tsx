import { Icon, Screen, Text } from "app/components";
import { OrdersList } from "app/components/Orders/OrdersList";
import { ScreenHeader } from "app/components/ScreenHeader";
import {
  $borderedArea,
  $containerPadding,
  $row,
  $screen,
} from "app/components/styles";
import { useOrderData, useUploadImage } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { colors, spacing } from "app/theme";
import { Order } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { BottomSheet, BottomSheetRef } from "app/components/Modal/BottomSheet";
import { ViewOrderModal } from "app/components/Orders/ViewOrder";
import { EmptyList } from "app/components/EmptyList";
import { SubscriptionNotice } from "app/components/Subscription/SubscriptionNotice";
import { selectSubscriptionValid } from "app/redux/selectors";
import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { updateOrder } from "app/apis/orders";
import { DriverAvailabilitySelect } from "app/components/Drivers/DriverAvailability";
import { pluralFormat } from "app/utils/general";

interface DriverOrdersScreenProps extends AppStackScreenProps<"Orders"> {}

export const DriverOrdersScreen = (props: DriverOrdersScreenProps) => {
  const viewOrderModal = useRef<BottomSheetRef>(null);
  const driverAvailabilityModal = useRef<BottomSheetRef>(null);

  const { uploadImage } = useUploadImage();

  const driver = useAppSelector((state) => state.driver.activeDriver?.id);
  const subscriptionValid = useAppSelector((state) =>
    selectSubscriptionValid(state)
  );

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const driverAvailability = useAppSelector(
    (state) => state.driverAvailability.data
  );

  const vendorLocations = useMemo(() => {
    return driverAvailability.map((d) => d.vendorLocation);
  }, [driverAvailability]);

  const { data, loadData } = useOrderData({
    vendorLocation: vendorLocations,
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

  const renderHeader = useCallback(
    () => (
      <>
        <ScreenHeader title={"Orders"} />
        <Pressable
          onPress={() => driverAvailabilityModal.current?.snapToIndex(0)}
          style={[
            { marginBottom: spacing.md, alignSelf: "flex-start" },
            $borderedArea,
          ]}
        >
          <Text>
            Delivering for {driverAvailability.length}{" "}
            {pluralFormat("location", driverAvailability.length)}
          </Text>
          <View style={$row}>
            <Icon icon={"swap-horizontal"} color={colors.primary} />
            <Text
              size={"xs"}
              style={{ color: colors.primary, marginLeft: spacing.xxs }}
            >
              Change availability
            </Text>
          </View>
        </Pressable>
      </>
    ),
    [driverAvailability]
  );
  const renderEmpty = useCallback(() => {
    if (!subscriptionValid) {
      return <EmptyList icon={"food"} title={"Find your orders here"} />;
    }
    return <EmptyList title={"No orders right now"} />;
  }, [subscriptionValid]);

  return (
    <>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <SubscriptionNotice style={{ marginBottom: spacing.md }} />
        {driverAvailability.length === 0 ? (
          <>
            <ScreenHeader title={"Orders"} />
            <DriverAvailabilitySelect />
          </>
        ) : (
          <OrdersList
            orders={data}
            loadOrders={loadData}
            onOrderPress={onOrderPress}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            onOrderCompleted={takeOrderDropOffPicture}
            showDriver={false}
            showVendorLocation={true}
          />
        )}
        <ViewOrderModal
          ref={viewOrderModal}
          onClose={closeCreateOrder}
          order={selectedOrder}
        />
        <BottomSheet ref={driverAvailabilityModal}>
          <DriverAvailabilitySelect
            onChange={() => driverAvailabilityModal.current?.collapse()}
          />
        </BottomSheet>
      </Screen>
    </>
  );
};
