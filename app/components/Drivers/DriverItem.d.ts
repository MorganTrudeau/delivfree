import { Driver } from "delivfree";
import React from "react";

export interface Props {
  driver: Driver;
  onPress?: (driver: Driver) => void;
  showStatus?: boolean;
}

export type DriverItem = React.FC<Props>;
