import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Customer, ModalRef, Order, OrderStatus } from "delivfree";
import { FlatList, FlatListProps, ViewStyle } from "react-native";
import { useAppSelector } from "app/redux/store";
import { updateOrder } from "app/apis/orders";
import { OrderItemMobile } from "./OrderItemMobile";
import { Props as OrderItemProps } from "./OrderItem";
import { $flex, LARGE_SCREEN } from "../styles";
import { useDimensions } from "app/hooks/useDimensions";
import { OrderItemWeb } from "./OrderItemWeb";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomerDetailModal } from "../Customers/CustomerDetailModal";
import { EmptyList } from "../EmptyList";
import { TableHeader, TableHeaders } from "../TableHeaders";
import { translate } from "app/i18n";
import { useToast } from "app/hooks";

type Props = {
  orders: Order[];
  loadOrders: () => void;
  onOrderPress: (order: Order) => void;
  onOrderCompleted?: (order: Order) => void;
  showDriver: boolean;
  showVendorLocation: boolean;
} & Partial<FlatListProps<Order>>;

export const OrdersList = ({
  orders,
  loadOrders,
  showDriver,
  showVendorLocation,
  onOrderPress,
  ListHeaderComponent,
  onOrderCompleted,
  ...rest
}: Props) => {
  const Toast = useToast();
  const insets = useSafeAreaInsets();
  const dimensions = useDimensions();
  const largeScreenLayout = dimensions.width > LARGE_SCREEN;

  const userType = useAppSelector((state) => state.appConfig.userType);

  useEffect(() => {
    loadOrders();
  }, []);

  const customerDetailModal = useRef<ModalRef>(null);

  const driver = useAppSelector((state) => state.driver.activeDriver);
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
        Toast.show(translate("errors.common"));
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

  const headers = useMemo(() => {
    const _headers: TableHeader[] = [
      { title: "Amount", value: "amount" },
      { title: "Tip", value: "tip" },
      { title: "Items", value: "items" },
      { title: "Date", value: "date" },
      {
        title: "Location",
        value: "vendorLocation",
        visible: showVendorLocation,
      },
      { title: "Driver", value: "driver", visible: showDriver },
      { title: "Status", value: "status" },
    ];
    return _headers.filter((h) => h.visible !== false);
  }, [showDriver]);

  const renderItem = useCallback(
    ({ item: order }: { item: Order }) => {
      const props: OrderItemProps = {
        order,
        claimLoading: claimLoading === order.id,
        userType,
        onOrderPress,
        claimOrder,
        driverId,
        changeOrderStatus: updateOrderStatus,
        driverName: order.driver
          ? `${vendorDrivers[order.driver]?.firstName || ""} ${
              vendorDrivers[order.driver]?.lastName || ""
            }`
          : "Unassigned",
        onViewCustomer: (customer: Customer) => {
          setViewCustomer(customer);
          customerDetailModal.current?.open();
        },
        onOrderCompleted,
        showDriver,
        showVendorLocation,
        headers,
      };
      return largeScreenLayout ? (
        <OrderItemWeb {...props} />
      ) : (
        <OrderItemMobile {...props} />
      );
    },
    [
      claimLoading,
      userType,
      onOrderPress,
      claimOrder,
      largeScreenLayout,
      headers,
    ]
  );

  const renderEmptyComponent = useCallback(
    () => <EmptyList title="No orders for this location" />,
    []
  );

  const renderListHeader = useCallback(() => {
    return (
      <>
        {ListHeaderComponent ? (
          React.isValidElement(ListHeaderComponent) ? (
            ListHeaderComponent
          ) : (
            //@ts-ignore
            <ListHeaderComponent />
          )
        ) : null}
        {largeScreenLayout && <TableHeaders headers={headers} />}
      </>
    );
  }, [ListHeaderComponent, largeScreenLayout, headers]);

  return (
    <>
      <FlatList
        data={orders}
        renderItem={renderItem}
        onEndReached={loadOrders}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[$content, { paddingBottom: insets.bottom }]}
        style={$flex}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
      <CustomerDetailModal
        ref={customerDetailModal}
        customer={viewCustomer}
        onDismiss={handleCustomerDetailModalClose}
      />
    </>
  );
};

const $content: ViewStyle = { flexGrow: 1 };
