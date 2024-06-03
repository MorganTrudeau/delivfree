import React, { useCallback, useMemo } from "react";
import { TableHeader, TableHeaders } from "../TableHeaders";
import {
  FlatList,
  FlatListProps,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import { VendorLocation } from "delivfree";
import { useDimensions } from "app/hooks/useDimensions";
import {
  $borderBottom,
  $borderBottomLight,
  $flex,
  $image,
  $imageContainer,
  $row,
  isLargeScreen,
} from "../styles";
import { TableCell } from "../TableCell";
import FastImage from "react-native-fast-image";
import { Text } from "../Text";
import { spacing } from "app/theme";
import { EmptyList } from "../EmptyList";
import { StatusIndicator } from "../StatusIndicator";

interface Props extends Partial<FlatListProps<VendorLocation>> {
  locations: VendorLocation[];
  onPress?: (location: VendorLocation) => void;
  headerStyle?: ViewStyle;
}

export const VendorLocationsList = ({
  locations,
  onPress,
  headerStyle,
  ...rest
}: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const _headers: TableHeader[] = [
      { title: "Name" },
      { title: "Address" },
      { title: "Status", maxWidth: 200 },
    ];
    return _headers;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: VendorLocation }) => {
      if (largeScreen) {
        return (
          <TableCell
            data={item}
            dataCells={[
              {
                renderData: () => (
                  <View style={[$row, $flex]}>
                    <View style={[$imageContainer, { maxWidth: 150 }]}>
                      <FastImage style={$image} source={{ uri: item.image }} />
                    </View>
                    <Text preset="semibold" style={{ marginLeft: spacing.sm }}>
                      {item.name}
                    </Text>
                  </View>
                ),
              },
              { text: item.address },
              {
                renderData: () => <StatusIndicator status={item.status} />,
                maxWidth: 200,
              },
            ]}
            onPress={onPress}
          />
        );
      } else {
        return (
          <Pressable
            onPress={() => onPress && onPress(item)}
            style={[$borderBottomLight, { paddingVertical: spacing.md }]}
          >
            <View style={$imageContainer}>
              <FastImage style={$image} source={{ uri: item.image }} />
            </View>
            <View style={{ flex: 1, marginTop: spacing.sm }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                preset="semibold"
                size={"lg"}
              >
                {item.name}
              </Text>
              <Text numberOfLines={1} ellipsizeMode="tail">
                {item.address}
              </Text>
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
    () => <EmptyList title="No locations" />,
    []
  );

  return (
    <>
      {largeScreen && <TableHeaders headers={headers} style={headerStyle} />}
      <FlatList
        data={locations}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        {...rest}
      />
    </>
  );
};
