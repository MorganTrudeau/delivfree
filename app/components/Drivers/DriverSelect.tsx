import React, { useEffect, useMemo, useState } from "react";
import { DropDownPicker } from "../DropDownPicker";
import { fetchDrivers } from "app/apis/driver";
import { Driver } from "delivfree";

export const DriverSelect = ({
  selectedDriver,
  vendorLocations,
  onDriverSelect,
  placeholder,
}: {
  vendorLocations: string[];
  onDriverSelect: (driver: Driver) => void;
  selectedDriver: string | null | undefined;
  placeholder?: string;
}) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const driverItems = useMemo(
    () =>
      drivers.map((d) => ({ value: d, label: `${d.firstName} ${d.lastName}` })),
    [drivers]
  );

  const selectedValues = useMemo(() => {
    const driver = selectedDriver
      ? drivers.find((d) => d.id === selectedDriver)
      : undefined;
    return driver ? [driver] : ([] as Driver[]);
  }, [selectedDriver, drivers]);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await fetchDrivers({ vendorLocations });
        setDrivers(data);
      } catch (error) {
        console.log("failed to load driver", error);
      }
    };
    loadDrivers();
  }, [vendorLocations]);

  return (
    <DropDownPicker
      items={driverItems}
      onSelect={(v) => onDriverSelect(v[0])}
      singleSelect
      selectedValues={selectedValues}
      placeholder={placeholder}
    />
  );
};
