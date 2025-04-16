import React, { useCallback, useMemo } from "react";
import { Menu } from "delivfree";
import { TableHeader, TableHeaders } from "../../TableHeaders";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  Pressable,
  View,
} from "react-native";
import { useDimensions } from "app/hooks/useDimensions";
import { $borderBottom, $row, isLargeScreen } from "../../styles";
import { DataCell, TableCell } from "../../TableCell";
import { Text } from "../../Text";
import { EmptyList } from "../../EmptyList";
import { Icon } from "../../Icon";
import { colors, spacing } from "app/theme";
import { formattedDaysAndTimes } from "app/utils/dates";

interface Props extends Omit<FlatListProps<Menu>, "data" | "renderItem"> {
  data: Menu[];
  onPress?: (data: Menu) => void;
  loaded: boolean;
}

export const MenusList = ({ data, onPress, loaded, ...rest }: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const h: TableHeader[] = [
      { title: "Name" },
      { title: "Hours" },
      { title: "Status" },
    ];
    return h;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Menu }) => {
      if (largeScreen) {
        const dataCells: DataCell[] = [
          { text: item.name },
          { text: formattedDaysAndTimes(item.hours[0]) },
          {
            renderData: () => (
              <View style={$row}>
                <Icon
                  icon={item.active ? "eye" : "eye-off"}
                  style={{ marginRight: spacing.xs }}
                />
                <Text>{item.active ? "Visible" : "Hidden"}</Text>
              </View>
            ),
          },
        ];
        return (
          <TableCell data={item} onPress={onPress} dataCells={dataCells} />
        );
      }

      return (
        <Pressable
          onPress={onPress ? () => onPress(item) : undefined}
          style={[{ paddingVertical: spacing.sm }, $borderBottom]}
        >
          <Text preset="subheading">{item.name}</Text>
          <Text>{item.active}</Text>
        </Pressable>
      );
    },
    [largeScreen]
  );

  const renderEmpty = useCallback(() => {
    return loaded ? (
      <EmptyList title="No menus" />
    ) : (
      <ActivityIndicator
        color={colors.primary}
        style={{ margin: spacing.md }}
      />
    );
  }, [loaded]);

  return (
    <>
      {largeScreen && <TableHeaders headers={headers} />}
      <FlatList
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
    </>
  );
};
