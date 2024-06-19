import React, { useCallback, useMemo } from "react";
import { FlatList, FlatListProps, ViewStyle } from "react-native";
import { Driver } from "delivfree";
import { TableHeader, TableHeaders } from "../TableHeaders";
import { useDimensions } from "app/hooks/useDimensions";
import { $flex, isLargeScreen } from "../styles";
import { DriverItemMobile } from "./DriverItemMobile";
import { DriverItemWeb } from "./DriverItemWeb";
import { Props as DriverItemProps } from "./DriverItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyList } from "../EmptyList";

interface Props extends Partial<FlatListProps<Driver>> {
  drivers: Driver[];
  onPress?: (driver: Driver) => void;
  showStatus?: boolean;
}

export const DriversList = ({
  drivers,
  onPress,
  showStatus,
  ...rest
}: Props) => {
  const insets = useSafeAreaInsets();
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const h: TableHeader[] = [{ title: "Name" }, { title: "Phone Number" }];

    if (showStatus) {
      h.push({ title: "Status" });
    }

    h.push({ title: "Updates", maxWidth: 100 });

    return h;
  }, [showStatus]);

  const renderItem = useCallback(
    ({ item }: { item: Driver }) => {
      const props: DriverItemProps = {
        driver: item,
        onPress: () => onPress && onPress(item),
        showStatus,
      };
      return largeScreen ? (
        <DriverItemWeb {...props} />
      ) : (
        <DriverItemMobile {...props} />
      );
    },
    [largeScreen, onPress]
  );

  const renderListEmpty = useCallback(
    () => <EmptyList title="No drivers" />,
    []
  );

  return (
    <>
      {largeScreen && <TableHeaders headers={headers} />}
      <FlatList
        data={drivers}
        renderItem={renderItem}
        style={$flex}
        contentContainerStyle={[$content, { paddingBottom: insets.bottom }]}
        ListEmptyComponent={renderListEmpty}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
    </>
  );
};

const $content: ViewStyle = { flexGrow: 1 };
