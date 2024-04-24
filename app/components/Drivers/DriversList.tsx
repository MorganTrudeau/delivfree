import React, { useCallback } from "react";
import { FlatList, FlatListProps, ViewStyle } from "react-native";
import { Driver } from "functions/src/types";
import { TableHeaders } from "../TableHeaders";
import { useDimensions } from "app/hooks/useDimensions";
import { $flex, LARGE_SCREEN } from "../styles";
import { DriverItemMobile } from "./DriverItemMobile";
import { DriverItemWeb } from "./DriverItemWeb";
import { Props as DriverItemProps } from "./DriverItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  return (
    <>
      {largeScreenLayout && <TableHeaders headers={headers} />}
      <FlatList
        data={drivers}
        renderItem={renderItem}
        style={$flex}
        contentContainerStyle={[$content, { paddingBottom: insets.bottom }]}
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
