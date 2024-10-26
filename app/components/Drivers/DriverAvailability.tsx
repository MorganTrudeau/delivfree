import { useAppSelector } from "app/redux/store";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { VendorLocationInfo } from "../VendorLocations/VendorLocationInfo";
import { Card } from "../Card";
import { Text } from "../Text";
import { Button } from "../Button";
import { colors, spacing } from "app/theme";
import { $borderBottom, $row } from "../styles";
import { Toggle } from "../Toggle";
import { useAlert } from "app/hooks";
import { changeDriverAvailability } from "app/apis/driverAvailablity";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { setDriverAvailability } from "app/redux/reducers/driverAvailability";

export const DriverAvailabilitySelect = ({
  onChange,
}: {
  onChange?: () => void;
}) => {
  const Alert = useAlert();

  const licenses = useAppSelector((state) => state.driver.licenses);
  const driver = useAppSelector((state) => state.driver.activeDriver);
  const currentAvailability = useAppSelector(
    (state) => state.driverAvailability.data
  );

  const licensesArray = useMemo(() => Object.values(licenses), [licenses]);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const handleLocationSelect = useCallback((vendorLocation: string) => {
    setSelectedLocations((state) =>
      state.includes(vendorLocation)
        ? state.filter((id) => id !== vendorLocation)
        : [...state, vendorLocation]
    );
  }, []);

  const startWork = async () => {
    if (!driver) {
      return Alert.alert(
        "Something went wrong",
        "Please restart the app and try again. If this issue persists please contact support."
      );
    }

    try {
      const driverAvailability = await changeDriverAvailability(
        driver.id,
        selectedLocations
      );
      setDriverAvailability(driverAvailability);
      onChange && onChange();
    } catch (error) {
      Alert.alert("Something went wrong", "Please try that again");
    }
  };

  const { exec: handleStartWork, loading } = useAsyncFunction(startWork);

  const Loading = useLoadingIndicator(loading);

  if (licensesArray.length === 0) {
    return (
      <Card>
        <Text preset="subheading">
          To start work you must have at least one active license.
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <Text preset="subheading">Set your availability</Text>
      <Text style={{ marginBottom: spacing.sm, color: colors.textDim }}>
        Select the restaurants you are delivering for today.
      </Text>
      {licensesArray.map((license) => {
        return (
          <VendorLocationSelectItem
            vendorLocationId={license.vendorLocation}
            onPress={handleLocationSelect}
            selected={selectedLocations.includes(license.vendorLocation)}
          />
        );
      })}
      <Button
        text="Change availability"
        style={{ marginTop: spacing.md }}
        preset={"reversed"}
        onPress={handleStartWork}
        RightAccessory={Loading}
        disabled={loading}
      />
    </Card>
  );
};

const VendorLocationSelectItem = ({
  vendorLocationId,
  onPress,
  selected,
}: {
  selected: boolean;
  vendorLocationId: string;
  onPress: (id: string) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Pressable
      style={[{ paddingVertical: spacing.sm }, $row, $borderBottom]}
      onPress={() => onPress(vendorLocationId)}
      disabled={!loaded}
    >
      <VendorLocationInfo
        vendorLocationId={vendorLocationId}
        style={{ flex: 1, paddingRight: spacing.sm }}
        onVendorLocationLoaded={() => setLoaded(true)}
      />
      <Toggle value={selected} />
    </Pressable>
  );
};
