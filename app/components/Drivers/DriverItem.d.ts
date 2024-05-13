import { Driver } from "delivfree";
import React from "react";

export interface Props {
  driver: Driver;
  onPress?: (driver: Driver) => void;
}

export type DriverItem = React.FC<Props>;
