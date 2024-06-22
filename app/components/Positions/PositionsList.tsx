import React, { useCallback, useMemo } from "react";
import { Positions, VendorLocation } from "delivfree";
import { TableHeader, TableHeaders } from "../TableHeaders";
import {
  FlatList,
  FlatListProps,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import { useDimensions } from "app/hooks/useDimensions";
import {
  $borderBottom,
  $borderBottomLight,
  $flex,
  $row,
  isLargeScreen,
} from "../styles";
import { TableCell } from "../TableCell";
import { Text } from "../Text";
import { spacing } from "app/theme";
import { StatusIndicator } from "../StatusIndicator";
import { EmptyList } from "../EmptyList";

interface Props extends Partial<FlatListProps<Positions>> {
  positions: Positions[];
  vendorLocations: { [id: string]: VendorLocation };
  onPress?: (positions: Positions) => void;
  headerStyle?: ViewStyle;
}

export const PositionsList = ({
  positions,
  vendorLocations,
  onPress,
  headerStyle,
  ListHeaderComponent,
  ...rest
}: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const _headers: TableHeader[] = [
      { title: "Location" },
      { title: "Full time", maxWidth: 250 },
      { title: "Part time", maxWidth: 250 },
      { title: "Status", maxWidth: 250 },
    ];
    return _headers;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Positions }) => {
      const vendorLocation = vendorLocations[item.vendorLocation] as
        | VendorLocation
        | undefined;
      if (largeScreen) {
        return (
          <TableCell
            data={item}
            onPress={onPress}
            dataCells={[
              {
                renderData: () =>
                  vendorLocation ? (
                    <View style={$flex}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        preset="semibold"
                      >
                        {vendorLocation.name}
                      </Text>
                      <Text size={"xs"} numberOfLines={1} ellipsizeMode="tail">
                        {vendorLocation.address}
                      </Text>
                    </View>
                  ) : (
                    <Text>Missing location</Text>
                  ),
              },
              {
                renderData: () => (
                  <View style={$flex}>
                    <Text size={"xs"}>
                      {item.maxFullTime - item.filledFullTime} Available
                    </Text>
                    <Text size={"xs"}>{item.filledFullTime} Filled</Text>
                  </View>
                ),
                maxWidth: 250,
              },
              {
                renderData: () => (
                  <View style={$flex}>
                    <Text size={"xs"}>
                      {item.maxPartTime - item.filledPartTime} Available
                    </Text>
                    <Text size={"xs"}>{item.filledPartTime} Filled</Text>
                  </View>
                ),
                maxWidth: 250,
              },
              {
                renderData: () => <StatusIndicator status={item.status} />,
                maxWidth: 250,
              },
            ]}
          />
        );
      } else {
        return (
          <Pressable
            onPress={() => onPress && onPress(item)}
            style={[$borderBottomLight, { paddingVertical: spacing.md }]}
          >
            {vendorLocation ? (
              <>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  preset="subheading"
                >
                  {vendorLocation.name}
                </Text>
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {vendorLocation.address}
                </Text>
              </>
            ) : (
              <Text>Missing location</Text>
            )}

            <Text preset="semibold" style={{ marginTop: spacing.xs }}>
              Full time
            </Text>
            <View style={$row}>
              <Text style={{ marginRight: spacing.md }}>
                {item.maxFullTime - item.filledFullTime} Available
              </Text>
              <Text>{item.filledFullTime} Filled</Text>
            </View>

            <Text preset="semibold" style={{ marginTop: spacing.xxs }}>
              Part time
            </Text>
            <View style={$row}>
              <Text style={{ marginRight: spacing.md }}>
                {item.maxPartTime - item.filledPartTime} Available
              </Text>
              <Text>{item.filledPartTime} Filled</Text>
            </View>

            <StatusIndicator
              status={item.status}
              style={{ marginTop: spacing.sm }}
            />
          </Pressable>
        );
      }
    },
    [largeScreen, onPress]
  );

  const renderEmptyList = useCallback(
    () => <EmptyList title="No positions" />,
    []
  );

  const renderListHeader = useCallback(() => {
    return (
      <>
        {ListHeaderComponent ? (
          React.isValidElement(ListHeaderComponent) ? (
            ListHeaderComponent
          ) : (
            //@ts-ignore
            <ListHeaderComponent />
          )
        ) : null}
        {largeScreen && <TableHeaders headers={headers} style={headerStyle} />}
      </>
    );
  }, [ListHeaderComponent, largeScreen]);

  return (
    <FlatList
      data={positions}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyList}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderListHeader}
      {...rest}
    />
  );
};
