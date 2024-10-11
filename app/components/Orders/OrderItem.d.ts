import { Customer, Order, OrderStatus, UserType } from "delivfree";
import React from "react";
import { TableHeader } from "../TableHeaders";

export type Props = {
  order: Order;
  claimLoading: boolean;
  userType: UserType | undefined;
  onOrderPress: (order: Order) => void;
  claimOrder: (orderId: string) => void;
  driverId: string | null | undefined;
  changeOrderStatus: (orderId: string, status: OrderStatus) => void;
  driverName: string;
  onViewCustomer: (customer: Customer) => void;
  onOrderCompleted?: (order: Order) => void;
  showDriver: boolean;
  showVendorLocation: boolean;
  headers: TableHeader[];
};

export type OrderItem = React.FC<Props>;
