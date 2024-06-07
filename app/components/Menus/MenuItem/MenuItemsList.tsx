import React, { useCallback, useMemo } from "react";
import { MenuCategory, MenuItem } from "functions/src/types";
import { TableHeader, TableHeaders } from "../../TableHeaders";
import { ActivityIndicator, FlatList, Pressable } from "react-native";
import { useDimensions } from "app/hooks/useDimensions";
import { isLargeScreen } from "../../styles";
import { DataCell, TableCell } from "../../TableCell";
import { Text } from "../../Text";
import { EmptyList } from "../../EmptyList";
import { localizeCurrency } from "app/utils/general";
import { colors, spacing } from "app/theme";

interface Props {
  items: MenuItem[];
  categories: MenuCategory[];
  onPress?: (data: MenuItem) => void;
  loaded: boolean;
}

export const MenuItemsList = ({
  items,
  categories,
  onPress,
  loaded,
}: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const h: TableHeader[] = [
      { title: "Name" },
      { title: "Price" },
      { title: "Categories" },
    ];
    return h;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MenuItem }) => {
      const categoryNames = item.categories.length
        ? item.categories
            .map((cId) => categories.find((c) => c.id === cId)?.name)
            .filter((c) => c)
            .join(", ")
        : "-";

      const price = localizeCurrency(Number(item.price), "CAD");

      if (largeScreen) {
        const dataCells: DataCell[] = [
          { text: item.name },
          {
            text: price,
          },
          { text: categoryNames },
        ];
        return (
          <TableCell data={item} onPress={onPress} dataCells={dataCells} />
        );
      }

      return (
        <Pressable onPress={onPress ? () => onPress(item) : undefined}>
          <Text preset="subheading">{item.name}</Text>
          <Text>{price}</Text>
          <Text>{categoryNames}</Text>
        </Pressable>
      );
    },
    [largeScreen, categories]
  );

  const renderEmpty = useCallback(() => {
    return loaded ? (
      <EmptyList title="No items" />
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
        data={items}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
      />
    </>
  );
};
