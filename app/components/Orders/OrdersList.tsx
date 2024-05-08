import React, { useCallback, useEffect, useRef, useState } from "react";
import { Customer, ModalRef, Order, OrderStatus } from "delivfree";
import { FlatList, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { useAppSelector } from "app/redux/store";
import { updateOrder } from "app/apis/orders";
import { OrderItemMobile } from "./OrderItemMobile";
import { Props as OrderItemProps } from "./OrderItem";
import { HEADERS, getHeaderWidth } from "app/utils/orders";
import { $flex, LARGE_SCREEN } from "../styles";
import { useDimensions } from "app/hooks/useDimensions";
import { OrderItemWeb } from "./OrderItemWeb";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomerDetailModal } from "../Customers/CustomerDetailModal";
import { EmptyList } from "../EmptyList";

interface Props {
  orders: Order[];
  loadOrders: () => void;
  onOrderPress: (order: Order) => void;
}

export const OrdersList = ({ orders, loadOrders, onOrderPress }: Props) => {
  const insets = useSafeAreaInsets();
  const dimensions = useDimensions();
  const largeScreenLayout = dimensions.width > LARGE_SCREEN;

  const userType = useAppSelector((state) => state.appConfig.userType);

  useEffect(() => {
    loadOrders();
  }, []);

  const customerDetailModal = useRef<ModalRef>(null);

  const customers = useAppSelector((state) => state.customers.data);
  const driver = useAppSelector((state) => state.driver.data);
  const vendorDrivers = useAppSelector((state) => state.vendorDrivers.data);
  const driverId = driver?.id;

  const [claimLoading, setClaimLoading] = useState("");
  const [viewCustomer, setViewCustomer] = useState<Customer>();

  const claimOrder = useCallback(
    async (orderId: string) => {
      try {
        if (!driverId) {
          throw "missing driver";
        }
        setClaimLoading(orderId);
        await updateOrder(orderId, { driver: driverId });
        setClaimLoading("");
      } catch (error) {
        setClaimLoading("");
        console.log("Failed to claim order", error);
      }
    },
    [driverId]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      try {
        await updateOrder(orderId, { status });
      } catch (error) {
        console.log("Failed to change status", error);
      }
    },
    []
  );

  const handleCustomerDetailModalClose = () => {
    setViewCustomer(undefined);
  };

  const renderHeader = () => {
    if (!largeScreenLayout) {
      return null;
    }
    return (
      <View style={$header}>
        {HEADERS.map((header) => (
          <View
            key={header}
            style={[$tableCell, { maxWidth: getHeaderWidth(header) }]}
          >
            <Text preset="subheading" size="xs">
              {header}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item: order }: { item: Order }) => {
      const props: OrderItemProps = {
        order: order,
        claimLoading: claimLoading === order.id,
        userType: userType,
        onOrderPress: onOrderPress,
        customer: customers[order.customer],
        claimOrder: claimOrder,
        driverId: driverId,
        changeOrderStatus: updateOrderStatus,
        driverName: order.driver
          ? `${vendorDrivers[order.driver]?.firstName} ${
              vendorDrivers[order.driver]?.lastName
            }`
          : "Unassigned",
        onViewCustomer: (customer: Customer) => {
          setViewCustomer(customer);
          customerDetailModal.current?.open();
        },
      };
      return largeScreenLayout ? (
        <OrderItemWeb {...props} />
      ) : (
        <OrderItemMobile {...props} />
      );
    },
    [claimLoading, userType, onOrderPress, claimOrder, largeScreenLayout]
  );

  const renderEmptyComponent = useCallback(
    () => <EmptyList title="No orders for this location" />,
    []
  );

  return (
    <>
      {renderHeader()}
      <FlatList
        data={orders}
        renderItem={renderItem}
        onEndReached={loadOrders}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[$content, { paddingBottom: insets.bottom }]}
        style={$flex}
      />
      <CustomerDetailModal
        ref={customerDetailModal}
        customer={viewCustomer}
        onDismiss={handleCustomerDetailModalClose}
      />
    </>
  );
};

const $header: ViewStyle = {
  paddingVertical: spacing.xs,
  flexDirection: "row",
  alignItems: "center",
  borderTopWidth: 1,
  borderTopColor: colors.border,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderLight,
};

const $tableCell: ViewStyle = {
  flex: 1,
  paddingEnd: spacing.md,
};

const $content: ViewStyle = { flexGrow: 1 };
