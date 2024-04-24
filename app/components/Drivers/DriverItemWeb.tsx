import { Props } from "./DriverItem";
import { useMemo } from "react";
import { DataCell, TableCell } from "../TableCell";

export const DriverItemWeb = ({ driver, onPress }: Props) => {
  const dataCells: DataCell[] = useMemo(
    () => [
      { text: `${driver.firstName} ${driver.lastName}` },
      { text: driver.phoneNumber },
    ],
    [driver]
  );
  return <TableCell data={driver} dataCells={dataCells} onPress={onPress} />;
};
