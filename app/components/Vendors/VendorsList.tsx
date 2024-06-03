import React, { useCallback, useMemo } from "react";
import { Vendor } from "delivfree";
import { TableHeader, TableHeaders } from "../TableHeaders";
import { FlatList, FlatListProps, Pressable, View } from "react-native";
import { useDimensions } from "app/hooks/useDimensions";
import { $borderBottom, $row, isLargeScreen } from "../styles";
import { TableCell } from "../TableCell";
import { Text } from "../Text";
import { spacing } from "app/theme";
import { EmptyList } from "../EmptyList";
import { StatusIndicator } from "../StatusIndicator";
import { NumberBubble } from "../NumberBubble";

interface Props extends Partial<FlatListProps<Vendor>> {
  vendors: Vendor[];
  onPress: (vendor: Vendor) => void;
}

export const VendorsList = ({ vendors, onPress, ...rest }: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const _headers: TableHeader[] = [
      { title: "Business" },
      { title: "First name" },
      { title: "Last name" },
      { title: "Phone number" },
      { title: "Status", maxWidth: 250 },
      { title: "Updates", maxWidth: 100 },
    ];
    return _headers;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Vendor }) => {
      const updates =
        item.pendingLocations.length + item.pendingPositions.length;

      if (largeScreen) {
        return (
          <TableCell
            data={item}
            onPress={onPress}
            dataCells={[
              { text: item.businessName },
              { text: item.firstName },
              { text: item.lastName },
              { text: item.callingCode + " " + item.phoneNumber },
              {
                maxWidth: 250,
                renderData: () => (
                  <StatusIndicator status={item.registration.status} />
                ),
              },
              {
                maxWidth: 100,
                renderData: () => <NumberBubble number={updates} />,
              },
            ]}
          />
        );
      } else {
        return (
          <Pressable
            onPress={() => onPress(item)}
            style={[$borderBottom, { paddingVertical: spacing.md }]}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" preset="subheading">
              {item.businessName}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {item.firstName} {item.lastName}
            </Text>
            <Text>{item.callingCode + " " + item.phoneNumber}</Text>
            <StatusIndicator
              status={item.registration.status}
              style={{ marginTop: spacing.sm }}
            />
            <View style={[$row, { marginTop: spacing.sm }]}>
              <NumberBubble number={updates} />
              <Text style={{ marginLeft: spacing.xs }}>Updates</Text>
            </View>
          </Pressable>
        );
      }
    },
    [largeScreen, onPress]
  );

  const renderEmptyList = useCallback(
    () => <EmptyList title={"No vendors"} />,
    []
  );

  return (
    <>
      {largeScreen && <TableHeaders headers={headers} />}
      <FlatList
        data={vendors}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        {...rest}
      />
    </>
  );
};
