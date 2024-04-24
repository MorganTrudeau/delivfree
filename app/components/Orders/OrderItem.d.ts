import { Customer, Order, OrderStatus, UserType } from "delivfree";
import React from "react";

export type Props = {
  order: Order;
  customer: Customer;
  claimLoading: boolean;
  userType: UserType | undefined;
  onOrderPress: (order: Order) => void;
  claimOrder: (orderId: string) => void;
  driverId: string | null | undefined;
  changeOrderStatus: (orderId: string, status: OrderStatus) => void;
  driverName: string;
  onViewCustomer: (customer: Customer) => void;
};

export type OrderItem = React.FC<Props>;
