import { colors } from "app/theme";
import { OrderStatus } from "functions/src/types";

export const HEADERS = [
  "Amount",
  "Tip",
  "Description",
  "Customer",
  "Date",
  "Driver",
  "Status",
] as const;

export const getHeaderWidth = (header: (typeof HEADERS)[number]) => {
  return undefined;
  switch (header) {
    case "Amount":
      140;
    case "Tip":
      return 140;
    case "Customer":
      return undefined;
    case "Date":
      return 200;
    case "Description":
      return undefined;
    case "Status":
      return 150;
    default:
      return 200;
  }
};

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
    case "in-progress":
      return colors.palette.accent500;
  }
};

export const getStatusText = (status: OrderStatus) => {
  switch (status) {
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
