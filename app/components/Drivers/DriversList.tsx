import React, { useCallback } from "react";
import { FlatList, FlatListProps, ViewStyle } from "react-native";
import { Driver } from "delivfree";
import { TableHeaders } from "../TableHeaders";
import { useDimensions } from "app/hooks/useDimensions";
import { $flex, LARGE_SCREEN } from "../styles";
import { DriverItemMobile } from "./DriverItemMobile";
import { DriverItemWeb } from "./DriverItemWeb";
import { Props as DriverItemProps } from "./DriverItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyList } from "../EmptyList";

interface Props extends Partial<FlatListProps<Driver>> {
  drivers: Driver[];
}

export const DriversList = ({ drivers, ...rest }: Props) => {
  const insets = useSafeAreaInsets();
  const dimensions = useDimensions();
  const largeScreenLayout = dimensions.width > LARGE_SCREEN;

  const renderItem = useCallback(
    ({ item }: { item: Driver }) => {
      const props: DriverItemProps = { driver: item };
      return largeScreenLayout ? (
        <DriverItemWeb {...props} />
      ) : (
        <DriverItemMobile {...props} />
      );
    },
    [largeScreenLayout]
  );

  const renderListEmpty = useCallback(
    () => <EmptyList title="You have not hired any drivers" />,
    []
  );

  return (
    <>
      {largeScreenLayout && <TableHeaders headers={headers} />}
      <FlatList
        data={drivers}
        renderItem={renderItem}
        style={$flex}
        contentContainerStyle={[$content, { paddingBottom: insets.bottom }]}
        ListEmptyComponent={renderListEmpty}
        {...rest}
      />
    </>
  );
};

const headers: { title: string }[] = [
  { title: "Name" },
  { title: "Phone Number" },
];

const $content: ViewStyle = { flexGrow: 1 };
