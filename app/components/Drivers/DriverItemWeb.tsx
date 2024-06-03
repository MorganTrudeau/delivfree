import { Props } from "./DriverItem";
import React, { useMemo } from "react";
import { DataCell, TableCell } from "../TableCell";
import { StatusIndicator } from "../StatusIndicator";
import { NumberBubble } from "../NumberBubble";

export const DriverItemWeb = ({ driver, onPress, showStatus }: Props) => {
  const dataCells: DataCell[] = useMemo(() => {
    const cells: DataCell[] = [
      { text: `${driver.firstName} ${driver.lastName}` },
      { text: driver.phoneNumber },
    ];
    if (showStatus) {
      cells.push({
        renderData: () => (
          <StatusIndicator status={driver.registration.status} />
        ),
      });
    }
    cells.push({
      maxWidth: 100,
      renderData: () => (
        <NumberBubble number={driver.pendingLicenses?.length || 0} />
      ),
    });
    return cells;
  }, [driver]);
  return <TableCell data={driver} dataCells={dataCells} onPress={onPress} />;
};
