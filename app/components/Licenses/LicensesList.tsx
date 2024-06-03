import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Driver, License, VendorLocation } from "delivfree";
import { TableHeader, TableHeaders } from "../TableHeaders";
import {
  FlatList,
  FlatListProps,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import { useDimensions } from "app/hooks/useDimensions";
import { $borderBottom, $flex, $row, isLargeScreen } from "../styles";
import { DataCell, TableCell } from "../TableCell";
import { Text } from "../Text";
import { spacing } from "app/theme";
import { StatusIndicator } from "../StatusIndicator";
import { EmptyList } from "../EmptyList";
import { fetchDriver } from "app/apis/driver";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props extends Partial<FlatListProps<License>> {
  licenses: License[];
  vendorLocations: { [id: string]: VendorLocation };
  onPress?: (positions: License) => void;
  headerStyle?: ViewStyle;
  showDriver?: boolean;
}

export const LicensesList = ({
  licenses,
  vendorLocations,
  onPress,
  headerStyle,
  showDriver = false,
  ...rest
}: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const _headers: TableHeader[] = [
      { value: "location", title: "Location" },
      { value: "driver", title: "Driver", visible: showDriver, maxWidth: 200 },
      { value: "full-time", title: "Full time", maxWidth: 200 },
      { value: "part-time", title: "Part time", maxWidth: 200 },
      { value: "status", title: "Approval Status", maxWidth: 200 },
    ];

    return _headers.filter((h) => h.visible !== false);
  }, [showDriver]);

  const renderItem = useCallback(
    ({ item }: { item: License }) => {
      const vendorLocation = vendorLocations[item.vendorLocation];
      if (largeScreen) {
        const dataCells: DataCell[] = headers.map(({ value, maxWidth }) => {
          switch (value) {
            case "location":
              return {
                maxWidth,
                renderData: () => (
                  <View style={$flex}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      preset="semibold"
                    >
                      {vendorLocation?.name}
                    </Text>
                    <Text size={"xs"} numberOfLines={1} ellipsizeMode="tail">
                      {vendorLocation?.address}
                    </Text>
                  </View>
                ),
              };
            case "driver":
              return {
                maxWidth,
                renderData: () => <DriverName driverId={item.driver} />,
              };
            case "full-time":
              return { maxWidth, text: `${item.fullTimePositions}` };
            case "part-time":
              return { maxWidth, text: `${item.partTimePositions}` };
            case "status":
              return {
                maxWidth,
                renderData: () => <StatusIndicator status={item.status} />,
              };
            default:
              return { text: "" };
          }
        });

        return (
          <TableCell data={item} onPress={onPress} dataCells={dataCells} />
        );
      } else {
        return (
          <Pressable
            onPress={() => onPress && onPress(item)}
            style={[$borderBottom, { paddingVertical: spacing.md }]}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" preset="subheading">
              {vendorLocation.name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {vendorLocation.address}
            </Text>

            <Text style={{ marginTop: spacing.xs }}>
              Full time: {item.fullTimePositions}
            </Text>

            <Text style={{ marginTop: spacing.xs, marginBottom: spacing.xs }}>
              Part time: {item.partTimePositions}
            </Text>

            <StatusIndicator status={item.status} />
          </Pressable>
        );
      }
    },
    [largeScreen, onPress]
  );

  const renderEmptyList = useCallback(
    () => <EmptyList title="No licenses" />,
    []
  );

  return (
    <>
      {largeScreen && <TableHeaders headers={headers} style={headerStyle} />}
      <FlatList
        data={licenses}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        {...rest}
      />
    </>
  );
};

const DriverName = ({ driverId }: { driverId: string }) => {
  const [driver, setDriver] = useState<Driver>();

  useEffect(() => {
    const loadDriver = async () => {
      const driverData = await fetchDriver(driverId);
      setDriver(driverData);
    };
    loadDriver();
  }, []);

  return (
    <LoadingPlaceholder loading={!driver} height={22} width={150}>
      <Text>
        {driver?.firstName} {driver?.lastName}
      </Text>
    </LoadingPlaceholder>
  );
};
