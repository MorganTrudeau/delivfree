import { colors } from "app/theme";
import { OrderStatus } from "delivfree";

export const HEADERS = [
  { title: "Amount" },
  { title: "Tip" },
  { title: "Items" },
  { title: "Date" },
  { title: "Driver" },
  { title: "Status" },
];

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "incomplete":
      return colors.error;
    case "canceled":
      return colors.palette.shade500;
    case "complete":
      return colors.success;
    case "arrived":
      return colors.palette.accent500;
    case "pending":
    case "in-progress":
      return colors.palette.accent500;
  }
};

export const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "incomplete":
      return "Incomplete";
    case "canceled":
      return "Cancelled";
    case "complete":
      return "Complete";
    case "arrived":
      return "Arrived";
    case "in-progress":
      return "In progress";
  }
};
